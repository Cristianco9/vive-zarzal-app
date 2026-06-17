// redirectView.js — minimal navigation helpers + logout handling + active menu highlight
// Comments in English per request. Load after header partial is rendered.

(function () {
  'use strict';

  /**
   * redirect(element)
   * Elements using data-path and onclick="redirect(this)" will navigate to the path.
   * Using this keeps navigation consistent across anchor-like elements and buttons.
   */
  window.redirect = function (el) {
    if (!el) return;
    var path = el.getAttribute('data-path');
    if (!path) return;
    // Basic client-side navigation:
    window.location.href = path;
  };

  /**
   * setActiveMenuFromLocation()
   * Finds nav links with data-path and sets the 'active' class on the link whose
   * path is the best match for the current location.pathname.
   * It uses startsWith so subroutes (e.g., /app/v1/services/123) are matched.
   */
  function setActiveMenuFromLocation() {
    var current = window.location.pathname || '/';
    // Normalize: remove trailing slash except for root
    if (current.length > 1 && current.endsWith('/')) {
      current = current.slice(0, -1);
    }

    var menuLinks = document.querySelectorAll('.nav-menu a[data-path]');

    var bestMatch = null;
    var bestLen = -1;

    menuLinks.forEach(function (link) {
      var target = link.getAttribute('data-path') || '';
      // Normalize target
      if (target.length > 1 && target.endsWith('/')) {
        target = target.slice(0, -1);
      }
      // if current starts with target, it's a candidate
      if (target && current.indexOf(target) === 0) {
        if (target.length > bestLen) {
          bestLen = target.length;
          bestMatch = link;
        }
      }
      // clear previous active classes
      link.classList.remove('active');
    });

    if (bestMatch) {
      bestMatch.classList.add('active');
    } else {
      // Fallback: exact match for root/home path
      var homeLink = document.querySelector('.nav-menu a[data-path="/app/v1/"]');
      if (homeLink) {
        homeLink.classList.remove('active'); // keep it not active unless it's home
      }
    }
  }

  // Intercept logout form submit (if present) to POST via fetch for a smoother UX.
  // If JS is disabled, the form will be submitted normally due to method="post" fallback.
  document.addEventListener('DOMContentLoaded', function () {
    // Set active menu according to current location
    setActiveMenuFromLocation();

    var logoutForm = document.querySelector('.logout-form');

    if (!logoutForm) return;

    logoutForm.addEventListener('submit', function (ev) {
      // Prevent normal form submit when JS available
      ev.preventDefault();

      var logoutUrl = logoutForm.getAttribute('action') || '/app/v1/logout';

      // Optional: Grab CSRF token if you include one in the DOM (uncomment if needed)
      // var csrfTokenEl = logoutForm.querySelector('input[name="_csrf"]');
      // var csrfToken = csrfTokenEl ? csrfTokenEl.value : null;

      fetch(logoutUrl, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
          // 'CSRF-Token': csrfToken
        },
        body: JSON.stringify({})
      })
        .then(function (resp) {
          // After logout, navigate to the app root
          window.location.href = '/app/v1/';
        })
        .catch(function (err) {
          // If fetch fails, fallback to classic navigation to ensure logout attempt
          console.error('Logout failed via fetch, falling back to form submit.', err);
          logoutForm.submit();
        });
    });
  });

  // If your app modifies the URL client-side (SPA navigation), call
  // window.setActiveMenuFromLocation() after route change.
  window.setActiveMenuFromLocation = setActiveMenuFromLocation;
})();