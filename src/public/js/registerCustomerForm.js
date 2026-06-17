// src/public/js/registerClient.js
// Validaciones básicas en cliente:
// - activación del botón submit solo si aceptó términos
// - comprobación de contraseñas iguales antes de enviar
// - muestra errores básicos en #formError

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerClientForm');
  const submitBtn = document.getElementById('submitBtn');
  const acceptTerms = document.getElementById('acceptTerms');
  const password = document.getElementById('password');
  const passwordConfirm = document.getElementById('passwordConfirm');
  const formError = document.getElementById('formError');

  function updateSubmitState() {
    submitBtn.disabled = !acceptTerms.checked;
  }

  acceptTerms.addEventListener('change', updateSubmitState);
  updateSubmitState();

  function showError(msg) {
    formError.textContent = msg;
    formError.style.display = msg ? 'block' : 'none';
  }

  form.addEventListener('submit', (ev) => {
    showError('');
    // Passwords match check
    if (password && passwordConfirm) {
      if (password.value !== passwordConfirm.value) {
        ev.preventDefault();
        showError('Las contraseñas no coinciden.');
        password.focus();
        return false;
      }
      // Optional: minimal strength check
      if (password.value.length < 8) {
        ev.preventDefault();
        showError('La contraseña debe tener al menos 8 caracteres.');
        password.focus();
        return false;
      }
    }

    // Ensure terms accepted (additional guard)
    if (!acceptTerms.checked) {
      ev.preventDefault();
      showError('Debes aceptar los términos y condiciones para continuar.');
      return false;
    }

    // Allow submission — server will handle actual registration
    return true;
  });
});