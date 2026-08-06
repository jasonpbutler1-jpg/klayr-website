# Connecting the Beta Feedback Form to the Dashboard

`feedback.html` is a branded web form with three modes — **Report a bug**,
**Request a feature**, and **General feedback** — whose fields match the
columns in the **Klayr Beta Testing Dashboard**. When a tester submits, a small
Google Apps Script writes the row into the correct tab automatically:

| Form mode | Writes to the tab whose header contains |
| --- | --- |
| Report a bug | `Issue Description` (Bug Tracker) |
| Request a feature | `Feature Requested` (Feature Requests) |
| General feedback | `What Worked Well` (User Feedback) |

A single native Google Form can only write to **one** tab — this approach
writes to all three from one form, and it fills the first empty row so your
auto-generated IDs (column A) and helper columns are preserved.

---

## One-time setup (about 10 minutes)

### 1. Add the script to your dashboard

1. Open the **Klayr Beta Testing Dashboard** Google Sheet.
2. Menu: **Extensions → Apps Script**. A new script project opens.
3. Delete any starter code in `Code.gs`, then paste the entire contents of
   `google-apps-script/Code.gs` from this repository.
4. Click **Save** (disk icon).

> It must be created from *inside* the sheet (Extensions → Apps Script) so the
> script is bound to this spreadsheet — that's how `SpreadsheetApp.getActive()`
> finds the right tabs.

### 2. Deploy it as a Web App

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the gear next to “Select type” and choose **Web app**.
3. Set:
   - **Description:** `Klayr feedback endpoint`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**
4. Click **Deploy**. Approve the permissions prompt (it will ask to manage the
   spreadsheet — that's expected).
5. Copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfy…/exec`.

### 3. Connect the form

1. Open `js/feedback.js`.
2. Replace the `ENDPOINT` value near the top:
   ```js
   var ENDPOINT = "https://script.google.com/macros/s/AKfy…/exec";
   ```
3. Save and upload the site (or push to GitHub Pages).

### 4. Test it

1. Open `feedback.html` in a browser.
2. Submit one of each type (bug, feature, feedback).
3. Check the dashboard — a new row should appear in each matching tab, with
   today's date filled in and the ID auto-generated in column A.

---

## How it decides where each submission goes

The script finds the target tab by **looking for a signature header** in row 1
(`Issue Description`, `Feature Requested`, or `What Worked Well`) rather than by
tab name — so renaming or renumbering tabs won't break it. It then writes into
the first row whose **Date** cell is empty, setting only the mapped data
columns. Column A (auto-ID) and helper columns are never written.

---

## Notes & limits

- **Success message is optimistic.** Google Apps Script can't return
  cross-origin response headers, so the browser can't read the response. The
  form sends the data (server-side write succeeds) and shows a thank-you once
  the request completes. If you want a guaranteed read-back, that requires a
  different backend (e.g. a serverless function that sets CORS headers).
- **Redeploying:** if you change `Code.gs`, use **Deploy → Manage deployments →
  edit → Version: New version** so the live URL keeps working. Creating a brand
  new deployment gives a new URL (which you'd have to paste again).
- **Keep the form unlisted if you like.** `feedback.html` is set to
  `noindex` and is intentionally not linked from the public pages' navigation —
  share the direct link with your testers (e.g. in TestFlight release notes).
- **Spreadsheet capacity:** the dashboard ships with 500 pre-formatted rows per
  tab. If a tab fills up, extend the formatting/formulas by dragging the last
  row down (see the dashboard's “Read Me First” tab).
