import logging
import os
import re
from typing import Any, Optional

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
GEMINI_API_KEY = (
    os.environ.get("GEMINI_API_KEY")
    or os.environ.get("GOOGLE_API_KEY")
    or os.environ.get("VERTEX_API_KEY", "")
)
DEFAULT_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
_MAX_MESSAGE_LEN = 8000

_client: Any = None


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
    if (
        isinstance(exc, errors.ClientError)
        and getattr(exc, "code", None) is not None
        and 400 <= int(exc.code) < 500
    ):
        return "The request could not be completed.", int(exc.code)
    return "The assistant could not complete your request. Please try again later.", 502


def _generate_text(user_message: str, system_instruction: Optional[str]) -> str:
    client = get_client()
    config: Optional[types.GenerateContentConfig] = None
    if system_instruction and system_instruction.strip():
        config = types.GenerateContentConfig(
            system_instruction=system_instruction.strip()[:_MAX_MESSAGE_LEN]
        )
    response = client.models.generate_content(
        model=DEFAULT_MODEL,
        contents=user_message,
        config=config,
    )
    if response is None or response.text is None:
        return ""
    return response.text


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


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "api_configured": bool(get_api_key()),
            "model": DEFAULT_MODEL,
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
