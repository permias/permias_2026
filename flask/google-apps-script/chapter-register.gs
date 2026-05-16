/**
 * PERMIAS Nasional — chapter registration → Google Sheets
 *
 * Sheet: https://docs.google.com/spreadsheets/d/14pvu2teLGzHSugD0VdAgYtPQqK5gDOuoKthZv2aq1dY/edit
 * Columns: Organization Name | University | City, State | President | Email | Phone | URL | Instagram
 *
 * Setup:
 * 1. Open the sheet → Extensions → Apps Script → paste this file.
 * 2. Deploy → New deployment → Web app (Execute as: Me, access: Anyone).
 * 3. Copy the deployment URL into Flask (legacy; chapter form now uses email via Flask SMTP/Resend).
 */

const SPREADSHEET_ID = '14pvu2teLGzHSugD0VdAgYtPQqK5gDOuoKthZv2aq1dY';

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** First tab (gid=0) — keep row 1 headers you already created in the sheet. */
function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheets()[0];
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Empty body' });
    }
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    sheet.appendRow([
      String(data.orgName || ''),
      String(data.school || ''),
      String(data.cityState || ''),
      String(data.presidentName || ''),
      String(data.email || ''),
      String(data.phone || ''),
      String(data.website || ''),
      String(data.instagram || ''),
    ]);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse({ ok: true, message: 'Chapter register endpoint' });
}
