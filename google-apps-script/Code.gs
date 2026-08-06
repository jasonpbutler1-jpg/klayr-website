/**
 * Klayr Beta Feedback — Google Apps Script Web App
 *
 * Receives submissions from feedback.html and writes each into the correct
 * tab of the Klayr Beta Testing Dashboard:
 *   - "bug"     -> the tab whose header row contains "Issue Description"
 *   - "feature" -> the tab whose header row contains "Feature Requested"
 *   - "feedback"-> the tab whose header row contains "What Worked Well"
 *
 * It writes into the FIRST EMPTY row (by the Date column), setting only the
 * mapped data columns — so the auto-ID formula in column A and the helper
 * columns are left untouched, exactly as if a tester typed the row in.
 *
 * SETUP: create this script from *inside* the dashboard
 * (Extensions > Apps Script), paste this file, then Deploy > New deployment >
 * Web app > Execute as: Me, Who has access: Anyone. Copy the Web app URL into
 * js/feedback.js (ENDPOINT). Full steps in SETUP-FEEDBACK-FORM.md.
 */

function doGet() {
  return ContentService
    .createTextOutput("Klayr feedback endpoint is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var type = (p.type || "").toLowerCase();

    // Each type: the header that identifies its tab, plus the field mapping
    // (form field name -> exact-ish dashboard header). Values written today's
    // date into "Date"; Bug rows are marked "Open".
    var routes = {
      bug: {
        signature: "Issue Description",
        constants: { "Date": new Date(), "Status": "Open" },
        map: {
          "Tester Name": p.tester,
          "Build Number": p.build_number,
          "Device": p.bug_device,
          "Screen": p.screen,
          "Issue Description": p.issue_description,
          "Steps To Reproduce": p.steps_to_reproduce,
          "Severity": p.severity
        }
      },
      feature: {
        signature: "Feature Requested",
        constants: { "Date": new Date() },
        map: {
          "Tester": p.tester,
          "Feature Requested": p.feature_requested,
          "Problem It Solves": p.problem_it_solves,
          "Priority": p.priority
        }
      },
      feedback: {
        signature: "What Worked Well",
        constants: { "Date": new Date() },
        map: {
          "Tester": p.tester,
          "Device": p.fb_device,
          "What Worked Well": p.what_worked_well,
          "What Was Confusing": p.what_was_confusing,
          "Favorite Feature": p.favorite_feature,
          "Feature They Wish Existed": p.feature_wish,
          "Overall Rating": p.overall_rating,
          "Additional Comments": p.additional_comments,
          "Feedback Category": p.feedback_category
        }
      }
    };

    var route = routes[type];
    if (!route) {
      return json_({ ok: false, error: "unknown_type" });
    }

    var ss = SpreadsheetApp.getActive();
    var sheet = findSheetByHeader_(ss, route.signature);
    if (!sheet) {
      return json_({ ok: false, error: "target_tab_not_found" });
    }

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0].map(function (h) { return String(h).trim(); });

    var dateCol = findColumn_(headers, "Date");
    if (dateCol < 1) {
      return json_({ ok: false, error: "no_date_column" });
    }

    var targetRow = firstEmptyRow_(sheet, dateCol);

    // Write constants (Date, Status) then mapped fields — never column A.
    writeFields_(sheet, headers, targetRow, route.constants);
    writeFields_(sheet, headers, targetRow, route.map);

    return json_({ ok: true, row: targetRow });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* ---------- helpers ---------- */

// Finds the first sheet whose header row (row 1) contains the given header.
function findSheetByHeader_(ss, header) {
  var target = header.toLowerCase();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var lastCol = sheets[i].getLastColumn();
    if (lastCol < 1) { continue; }
    var row = sheets[i].getRange(1, 1, 1, lastCol).getValues()[0];
    for (var c = 0; c < row.length; c++) {
      if (String(row[c]).trim().toLowerCase() === target) {
        return sheets[i];
      }
    }
  }
  return null;
}

// Returns the 1-based column index for a header: exact match first, then
// "contains" (so "Overall Rating (1-10)" matches "Overall Rating").
function findColumn_(headers, wanted) {
  var w = wanted.trim().toLowerCase();
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].toLowerCase() === w) { return i + 1; }
  }
  for (var j = 0; j < headers.length; j++) {
    if (headers[j].toLowerCase().indexOf(w) !== -1) { return j + 1; }
  }
  return -1;
}

// First row (>= 2) whose Date cell is blank. Skips template rows (Date has a
// value). Scans the sheet's full row capacity so pre-built empty rows count.
function firstEmptyRow_(sheet, dateCol) {
  var maxRows = sheet.getMaxRows();
  if (maxRows < 2) { return 2; }
  var values = sheet.getRange(2, dateCol, maxRows - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === "") {
      return i + 2;
    }
  }
  return maxRows + 1; // all full — append past the formatted range
}

// Sets each mapped value into its header's column at the given row.
function writeFields_(sheet, headers, row, fields) {
  Object.keys(fields).forEach(function (headerName) {
    var value = fields[headerName];
    if (value === undefined || value === null || value === "") { return; }
    var col = findColumn_(headers, headerName);
    if (col > 0) {
      sheet.getRange(row, col).setValue(value);
    }
  });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
