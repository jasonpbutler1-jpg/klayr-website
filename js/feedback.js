/* Klayr Beta Feedback form
   - Shows the fields relevant to the selected submission type.
   - Submits to a Google Apps Script Web App that routes the row into the
     correct dashboard tab (Bug Tracker / Feature Requests / User Feedback).
   No inline JS; loaded with `defer`. */
(function () {
  "use strict";

  /* ======================================================================
     CONFIG — replace with your deployed Apps Script Web App URL.
     See SETUP-FEEDBACK-FORM.md for how to get this URL.
     ====================================================================== */
  var ENDPOINT = "REPLACE_WITH_APPS_SCRIPT_WEB_APP_URL";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("feedback-form");
    var typeSelect = document.getElementById("type");
    var status = document.getElementById("form-status");
    var submitBtn = document.getElementById("submit-btn");
    if (!form || !typeSelect) {
      return;
    }

    var sections = {
      bug: document.getElementById("section-bug"),
      feature: document.getElementById("section-feature"),
      feedback: document.getElementById("section-feedback")
    };

    // Show only the section matching the selected type.
    function showSection(type) {
      Object.keys(sections).forEach(function (key) {
        if (sections[key]) {
          sections[key].hidden = key !== type;
        }
      });
    }

    showSection(typeSelect.value);
    typeSelect.addEventListener("change", function () {
      showSection(typeSelect.value);
    });

    function setStatus(message, state) {
      status.textContent = message;
      status.setAttribute("data-state", state);
      status.hidden = false;
    }

    // Lightweight required-field check for the visible section only.
    function validate(type) {
      var tester = document.getElementById("tester");
      if (!tester.value.trim()) {
        return "Please enter your name.";
      }
      if (type === "bug" && !document.getElementById("bug-desc").value.trim()) {
        return "Please describe what went wrong.";
      }
      if (type === "feature" && !document.getElementById("feature-name").value.trim()) {
        return "Please describe the feature you'd like.";
      }
      return null;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var type = typeSelect.value;
      var problem = validate(type);
      if (problem) {
        setStatus(problem, "error");
        return;
      }

      if (ENDPOINT.indexOf("REPLACE_WITH") === 0) {
        setStatus("This form isn't connected yet. Add your Apps Script URL in js/feedback.js.", "error");
        return;
      }

      // Collect fields as application/x-www-form-urlencoded (a "simple"
      // request, so no CORS preflight is triggered).
      var data = new URLSearchParams(new FormData(form));

      submitBtn.disabled = true;
      setStatus("Sending…", "success");

      fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors", // Apps Script can't send CORS headers; response is opaque.
        body: data
      })
        .then(function () {
          // With no-cors the response is opaque; treat a completed request as
          // success (the Apps Script writes the row server-side).
          form.reset();
          showSection(typeSelect.value);
          setStatus("Thank you! Your feedback was submitted.", "success");
        })
        .catch(function () {
          setStatus("Something went wrong sending your feedback. Please try again.", "error");
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  });
})();
