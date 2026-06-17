import logging
import os
import re
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any, Optional
from urllib.parse import urlparse

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.errors import RateLimitExceeded
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
from google import genai
from google.genai import errors, types
from werkzeug.exceptions import RequestEntityTooLarge

load_dotenv()

logger = logging.getLogger(__name__)
logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"))


def _rate_limit_key() -> str:
    if os.environ.get("TRUST_X_FORWARDED_FOR", "").lower() in ("1", "true", "yes"):
        xff = request.headers.get("X-Forwarded-For", "")
        if xff:
            return xff.split(",")[0].strip()[:200]
    return get_remote_address()


app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = int(os.environ.get("MAX_REQUEST_BYTES", str(64 * 1024)))

_cors_origins = os.environ.get("CORS_ORIGINS", "*")
if _cors_origins == "*":
    CORS(app, resources={r"/api/*": {"origins": "*"}})
else:
    CORS(
        app,
        resources={r"/api/*": {"origins": [o.strip() for o in _cors_origins.split(",") if o.strip()]}},
    )

CHAT_RATE_LIMIT = os.environ.get("CHAT_RATE_LIMIT", "20 per minute")
CHAPTER_REGISTER_RATE_LIMIT = os.environ.get("CHAPTER_REGISTER_RATE_LIMIT", "5 per minute")
CHAPTER_REGISTER_TO = os.environ.get(
    "CHAPTER_REGISTER_TO", "info@permiasnasional.com"
).strip()
CONTACT_TO = os.environ.get("CONTACT_TO", "info@permiasnasional.com").strip()
CONTACT_RATE_LIMIT = os.environ.get("CONTACT_RATE_LIMIT", "10 per minute")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
MAIL_FROM = os.environ.get(
    "MAIL_FROM", "PERMIAS Nasional <noreply@permiasnasional.com>"
).strip()
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com").strip()
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "").strip()
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "").strip()
SMTP_FROM = os.environ.get("SMTP_FROM", SMTP_USER or MAIL_FROM).strip()
MAIL_DEV_LOG = os.environ.get("MAIL_DEV_LOG", "").lower() in ("1", "true", "yes")
_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
_storage = os.environ.get("RATELIMIT_STORAGE_URI", "memory://")
limiter = Limiter(
    _rate_limit_key,
    app=app,
    default_limits=[],
    storage_uri=_storage,
)


def _exempt_cors_options() -> bool:
    return request.method == "OPTIONS"


@app.errorhandler(RequestEntityTooLarge)
def _request_too_large(_: RequestEntityTooLarge):
    return jsonify({"error": "Request body is too large."}), 413


@app.errorhandler(RateLimitExceeded)
def _handle_rate_limit_exceeded(_: RateLimitExceeded):
    return (
        jsonify(
            {
                "error": "Too many requests. Please wait a moment and try again.",
            }
        ),
        429,
    )


# Server-side only. See https://ai.google.dev/gemini-api/docs/models
def _env_key(name: str) -> str:
    return os.environ.get(name, "").strip()


GEMINI_API_KEY = (
    _env_key("GEMINI_API_KEY")
    or _env_key("GOOGLE_API_KEY")
    or _env_key("VERTEX_API_KEY")
)
DEFAULT_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash").strip()
_MODEL_FALLBACKS = os.environ.get("GEMINI_MODEL_FALLBACKS", "gemini-2.0-flash,gemini-2.0-flash-lite")
_MAX_MESSAGE_LEN = 8000

_client: Any = None


def _chat_models() -> list[str]:
    models: list[str] = []
    for candidate in [DEFAULT_MODEL, *_MODEL_FALLBACKS.split(",")]:
        name = candidate.strip()
        if name and name not in models:
            models.append(name)
    return models or ["gemini-2.5-flash"]


def get_api_key() -> str:
    return str(GEMINI_API_KEY or "").strip()


def get_client():
    global _client
    if _client is not None:
        return _client
    key = get_api_key()
    if not key:
        raise RuntimeError("GEMINI_API_KEY (or GOOGLE_API_KEY or VERTEX_API_KEY) is not set")
    _client = genai.Client(api_key=key)
    return _client


def _user_text(data: dict) -> Optional[str]:
    msg = data.get("message")
    if not isinstance(msg, str):
        return None
    t = msg.strip()
    if not t:
        return None
    return t[:_MAX_MESSAGE_LEN]


def _plain_chat_reply(text: str) -> str:
    """Remove common markdown bold/italic markers so the widget shows plain text."""
    if not text or not str(text).strip():
        return text
    t = str(text)
    for _ in range(6):
        prev = t
        t = re.sub(r"\*\*([^*]+)\*\*", r"\1", t)
        t = re.sub(r"__([^_]+)__", r"\1", t)
        if t == prev:
            break
    t = t.replace("**", "")
    t = t.replace("__", "")
    return t


def _public_gemini_error(exc: BaseException) -> tuple[str, int]:
    """Short client-safe message + HTTP status; log details server-side only."""
    if isinstance(exc, errors.APIError) and getattr(exc, "code", None) == 429:
        return (
            "The AI service is busy. Please wait a moment and try again.",
            429,
        )
    if isinstance(exc, errors.ClientError):
        code = getattr(exc, "code", None)
        if code is not None and int(code) in (401, 403):
            return (
                "Chat is not configured correctly on the server. Check the Gemini API key.",
                503,
            )
        if code is not None and 400 <= int(code) < 500:
            return "The request could not be completed.", int(code)
    return "The assistant could not complete your request. Please try again later.", 502


def _generate_text(user_message: str, system_instruction: Optional[str]) -> str:
    client = get_client()
    config: Optional[types.GenerateContentConfig] = None
    if system_instruction and system_instruction.strip():
        config = types.GenerateContentConfig(
            system_instruction=system_instruction.strip()[:_MAX_MESSAGE_LEN]
        )

    last_exc: Optional[BaseException] = None
    for model in _chat_models():
        try:
            response = client.models.generate_content(
                model=model,
                contents=user_message,
                config=config,
            )
            if response is None or response.text is None:
                return ""
            if model != DEFAULT_MODEL:
                logger.info("Gemini reply served by fallback model %s", model)
            return response.text
        except errors.ClientError as exc:
            last_exc = exc
            code = getattr(exc, "code", None)
            if code is not None and int(code) == 429:
                raise
            logger.warning("Gemini model %s failed (%s): %s", model, code, exc)
        except errors.APIError as exc:
            last_exc = exc
            if getattr(exc, "code", None) == 429:
                raise
            logger.warning("Gemini model %s failed: %s", model, exc)

    if last_exc is not None:
        raise last_exc
    return ""


@app.route("/api/chat", methods=["POST", "OPTIONS"])
@limiter.limit(CHAT_RATE_LIMIT, exempt_when=_exempt_cors_options)
def chat_for_site():
    if request.method == "OPTIONS":
        return "", 204
    if not get_api_key():
        return jsonify({"error": "Chat is not configured on the server. Set GEMINI_API_KEY."}), 503

    data = request.get_json(silent=True) or {}
    user_message = _user_text(data)
    if not user_message:
        return jsonify({"error": "Missing or empty message field."}), 400

    system = data.get("system")
    system_s = system.strip()[:_MAX_MESSAGE_LEN] if isinstance(system, str) else None

    try:
        reply = _plain_chat_reply(_generate_text(user_message, system_s))
        if not reply or not str(reply).strip():
            return jsonify({"error": "The model returned an empty response."}), 502
        return jsonify({"reply": reply})
    except Exception as e:  # noqa: BLE001
        logger.exception("POST /api/chat failed")
        msg, status = _public_gemini_error(e)
        return jsonify({"error": msg}), status


def _str_field(data: dict, key: str, *, max_len: int, required: bool = True) -> Optional[str]:
    val = data.get(key)
    if val is None or not isinstance(val, str):
        return None if required else ""
    t = val.strip()
    if required and not t:
        return None
    return t[:max_len]


def _optional_url(data: dict, key: str) -> str:
    t = _str_field(data, key, max_len=500, required=False) or ""
    if not t:
        return ""
    if not re.match(r"^https?://", t, re.I):
        t = f"https://{t}"
    parsed = urlparse(t)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise ValueError(f"Invalid {key}.")
    return t[:500]


def _parse_chapter_register(data: dict) -> dict:
    org_name = _str_field(data, "orgName", max_len=200)
    school = _str_field(data, "school", max_len=200)
    city_state = _str_field(data, "cityState", max_len=120)
    president = _str_field(data, "presidentName", max_len=120) or _str_field(
        data, "fullName", max_len=120
    )
    email = _str_field(data, "email", max_len=254)
    phone = _str_field(data, "phone", max_len=40)

    if not all([org_name, school, city_state, president, email, phone]):
        raise ValueError("Missing required fields.")
    if not _EMAIL_RE.match(email):
        raise ValueError("Invalid email address.")
    if len(re.sub(r"\D", "", phone)) < 7:
        raise ValueError("Invalid phone number.")

    website = _optional_url(data, "website")
    instagram_raw = _str_field(data, "instagram", max_len=120, required=False) or ""
    instagram = instagram_raw.lstrip("@")[:120]

    return {
        "orgName": org_name,
        "school": school,
        "cityState": city_state,
        "presidentName": president,
        "email": email,
        "phone": phone,
        "website": website,
        "instagram": instagram,
    }


def _parse_recipients(raw: str) -> list[str]:
    return [a.strip() for a in raw.split(",") if a.strip()]


def _mail_configured() -> bool:
    if RESEND_API_KEY:
        return True
    return bool(SMTP_USER and SMTP_PASSWORD)


def _format_chapter_register_email(payload: dict) -> tuple[str, str]:
    website = payload["website"] or "(not provided)"
    instagram = payload["instagram"] or "(not provided)"
    if instagram != "(not provided)" and not instagram.startswith("@"):
        instagram = f"@{instagram}"

    subject = f"[PERMIAS] New club registration: {payload['orgName']}"
    body = f"""New club registration submitted via permiasnasional.com

Organization: {payload['orgName']}
University: {payload['school']}
City, State: {payload['cityState']}
Full name: {payload['presidentName']}
Contact email: {payload['email']}
Contact phone: {payload['phone']}
Website: {website}
Instagram: {instagram}
"""
    return subject, body


def _send_email(*, to: list[str], reply_to: str, subject: str, body: str) -> None:
    if not to:
        raise RuntimeError("No email recipients configured.")
    if not _mail_configured():
        if MAIL_DEV_LOG:
            logger.info(
                "MAIL_DEV_LOG — email not sent (SMTP/Resend not configured)\n"
                "To: %s\nReply-To: %s\nSubject: %s\n\n%s",
                ", ".join(to),
                reply_to,
                subject,
                body,
            )
            return
        raise RuntimeError("Outbound email is not configured.")

    if RESEND_API_KEY:
        resp = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "from": MAIL_FROM,
                "to": to,
                "reply_to": reply_to,
                "subject": subject,
                "text": body,
            },
            timeout=15,
        )
        if resp.status_code >= 400:
            logger.warning("Resend HTTP %s: %s", resp.status_code, resp.text[:300])
            raise RuntimeError("Email provider rejected the message.")
        return

    msg = MIMEMultipart()
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM
    msg["To"] = ", ".join(to)
    msg["Reply-To"] = reply_to
    msg.attach(MIMEText(body, "plain", "utf-8"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as smtp:
        smtp.starttls()
        smtp.login(SMTP_USER, SMTP_PASSWORD)
        smtp.sendmail(SMTP_FROM, to, msg.as_string())


def _send_chapter_register_email(payload: dict) -> None:
    subject, body = _format_chapter_register_email(payload)
    _send_email(
        to=_parse_recipients(CHAPTER_REGISTER_TO),
        reply_to=payload["email"],
        subject=subject,
        body=body,
    )


def _parse_contact(data: dict) -> dict:
    name = _str_field(data, "name", max_len=120)
    email = _str_field(data, "email", max_len=254)
    subject_key = _str_field(data, "subject", max_len=40)
    message = _str_field(data, "message", max_len=8000)

    if not all([name, email, subject_key, message]):
        raise ValueError("Missing required fields.")
    if not _EMAIL_RE.match(email):
        raise ValueError("Invalid email address.")
    if subject_key not in ("general", "chapter", "media", "partner"):
        raise ValueError("Invalid subject.")

    return {"name": name, "email": email, "subject": subject_key, "message": message}


_CONTACT_SUBJECT_LABELS = {
    "general": "General",
    "chapter": "Chapter registration",
    "media": "Media / press",
    "partner": "Partnership",
}


def _format_contact_email(payload: dict) -> tuple[str, str]:
    label = _CONTACT_SUBJECT_LABELS.get(payload["subject"], payload["subject"])
    subject = f"[PERMIAS] Contact form: {label}"
    body = f"""New message from the PERMIAS Nasional contact form

Name: {payload['name']}
Email: {payload['email']}
Subject: {label}

Message:
{payload['message']}
"""
    return subject, body


def _send_contact_email(payload: dict) -> None:
    subject, body = _format_contact_email(payload)
    _send_email(
        to=_parse_recipients(CONTACT_TO),
        reply_to=payload["email"],
        subject=subject,
        body=body,
    )


@app.route("/api/chapter-register", methods=["POST", "OPTIONS"])
@limiter.limit(CHAPTER_REGISTER_RATE_LIMIT, exempt_when=_exempt_cors_options)
def chapter_register():
    if request.method == "OPTIONS":
        return "", 204
    if not _mail_configured() and not MAIL_DEV_LOG:
        return jsonify(
            {
                "error": "Email is not configured on the server. Set SMTP_USER/SMTP_PASSWORD or RESEND_API_KEY."
            }
        ), 503

    data = request.get_json(silent=True) or {}
    try:
        payload = _parse_chapter_register(data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    try:
        _send_chapter_register_email(payload)
        return jsonify({"ok": True})
    except Exception:  # noqa: BLE001
        logger.exception("POST /api/chapter-register failed")
        return jsonify({"error": "Could not send your registration. Please try again later."}), 502


@app.route("/api/contact", methods=["POST", "OPTIONS"])
@limiter.limit(CONTACT_RATE_LIMIT, exempt_when=_exempt_cors_options)
def contact():
    if request.method == "OPTIONS":
        return "", 204
    if not _mail_configured() and not MAIL_DEV_LOG:
        return jsonify(
            {"error": "Email is not configured on the server. Set SMTP_USER/SMTP_PASSWORD or RESEND_API_KEY."}
        ), 503

    data = request.get_json(silent=True) or {}
    try:
        payload = _parse_contact(data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    try:
        _send_contact_email(payload)
        return jsonify({"ok": True, "message": "Received"})
    except Exception:  # noqa: BLE001
        logger.exception("POST /api/contact failed")
        return jsonify({"error": "Could not send your message. Please try again later."}), 502


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "api_configured": bool(get_api_key()),
            "model": DEFAULT_MODEL,
            "mail_configured": _mail_configured(),
            "mail_dev_log": MAIL_DEV_LOG,
            "chapter_register_configured": (_mail_configured() or MAIL_DEV_LOG)
            and bool(_parse_recipients(CHAPTER_REGISTER_TO)),
            "contact_configured": (_mail_configured() or MAIL_DEV_LOG)
            and bool(_parse_recipients(CONTACT_TO)),
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
