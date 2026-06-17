(async function () {
  'use strict';

  /**
   * handleSubmit(event)
   * Uses the form 'action' attribute (fallback to '/app/v1/users/login').
   * Sends credentials as { credentials } JSON payload.
   * On 200 -> redirect to /app/v1/dashboard
   * On 401/404 -> replace document.body with server HTML (per original logic)
   * Network errors -> show user-friendly message in #wrong-input
   */
  async function handleSubmit(event) {
    event.preventDefault();

    // Elements and values
    const form = event.currentTarget;
    const actionUrl = form.getAttribute('action') || '/app/v1/users/login';
    const userName = document.getElementById('username')?.value || '';
    const password = document.getElementById('password')?.value || '';

    // Locate or create the error container used to show messages
    let wrongInput = document.getElementById('wrong-input');
    if (!wrongInput) {
      wrongInput = document.createElement('div');
      wrongInput.id = 'wrong-input';
      wrongInput.style.display = 'none';
      wrongInput.className = 'form-error';
      // Insert the error container just above the form actions if possible, otherwise at the top of the form
      const actions = form.querySelector('.form-actions');
      if (actions) actions.parentNode.insertBefore(wrongInput, actions);
      else form.insertBefore(wrongInput, form.firstChild);
    }

    // Reset previous messages
    wrongInput.textContent = '';
    wrongInput.style.display = 'none';

    // Small UX: disable submit button and show loading label
    const submitBtn = form.querySelector('.btn-login');
    const origBtnText = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Ingresando...';
    }

    const credentials = { userName, password };

    try {
      const response = await fetch(actionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // If you use CSRF, include token header here, e.g. 'CSRF-Token': csrfToken
        },
        credentials: 'same-origin',
        body: JSON.stringify({ credentials })
      });

      if (response.status === 200) {
        // Successful login — navigate to dashboard
        window.location.href = '/app/v1/dashboard';
        return;
      }

      if (response.status === 401 || response.status === 404) {
        // Original logic replaced the document body with server HTML.
        // This mirrors that behavior exactly: get HTML and replace document.body.
        const html = await response.text();
        document.body.innerHTML = html;

        // After replacing body, try to attach listener to the accept button if it exists.
        // There is no guarantee of lifecycle here; we attempt best-effort.
        const acceptButton = document.querySelector('.button');
        if (acceptButton) {
          acceptButton.addEventListener('click', function () {
            window.location.href = '/app/v1/';
          });
        }
        return;
      }

      // Other non-success statuses: attempt to parse JSON for message, otherwise show generic error
      let errMsg = 'Error en el inicio de sesión';
      try {
        const payload = await response.json();
        if (payload && payload.message) errMsg = payload.message;
      } catch (e) {
        // not JSON — attempt to read text
        try {
          const text = await response.text();
          if (text) errMsg = text;
        } catch (ignore) {}
      }

      wrongInput.textContent = errMsg;
      wrongInput.style.display = 'block';
    } catch (error) {
      // Network / fetch error
      wrongInput.textContent = 'Error de conexión con el servidor';
      wrongInput.style.display = 'block';
      console.error('Login fetch error:', error);
    } finally {
      // restore submit button state if still present (not redirected)
      if (submitBtn) {
        submitBtn.disabled = false;
        if (origBtnText) submitBtn.textContent = origBtnText;
      }
    }
  }

  // Attach handler on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', handleSubmit);
  });
})();