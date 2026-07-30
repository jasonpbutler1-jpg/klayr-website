/* Klayr Website — minimal progressive enhancement
   Handles the responsive navigation toggle with correct ARIA state.
   No inline JS anywhere; this file is loaded with `defer`. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the menu when a link is chosen (mobile).
    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });
})();
