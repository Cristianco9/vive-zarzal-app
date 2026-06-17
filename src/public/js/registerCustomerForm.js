// src/public/js/registerClient.js
// Carga géneros y tipos de documento y envía el payload en la forma
// que espera el endpoint (/app/v1/users/create) — campos en el cuerpo raíz.

document.addEventListener('DOMContentLoaded', () => {
  const GENDERS_API = '/app/v1/genders/list-all';
  const DOC_TYPES_API = '/app/v1/document-types/list-all';
  const REGISTER_API = '/app/v1/users/create';

  // En tu BD: 1 = Administrador, 2 = Anunciante, 3 = Cliente
  const CLIENTE_ROLE_ID = 3;

  const form = document.getElementById('registerClientForm');
  const submitBtn = document.getElementById('submitBtn');
  const acceptTerms = document.getElementById('acceptTerms');
  const password = document.getElementById('password');
  const passwordConfirm = document.getElementById('passwordConfirm');
  const formError = document.getElementById('formError');

  const genderSelect = document.getElementById('gender');
  const docTypeSelect = document.getElementById('docType');

  let gendersArray = [];
  let docTypesArray = [];

  function showError(msg) {
    if (!formError) return;
    formError.textContent = msg || '';
    formError.style.display = msg ? 'block' : 'none';
  }

  function updateSubmitState() {
    if (!submitBtn) return;
    submitBtn.disabled = !(acceptTerms && acceptTerms.checked);
  }
  if (acceptTerms) {
    acceptTerms.addEventListener('change', updateSubmitState);
    updateSubmitState();
  }

  // Helpers
  function extractArrayFromResponse(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.roles)) return data.roles;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.result)) return data.result;
    for (const k of Object.keys(data || {})) {
      if (Array.isArray(data[k])) return data[k];
    }
    return [];
  }

  function optionTextAndValue(item) {
    if (item == null) return { text: String(item), value: String(item) };
    if (typeof item === 'string') return { text: item, value: item };

    const textProps = ['name', 'nombre', 'label', 'title', 'descripcion', 'description', 'display', 'tipo'];
    const valueProps = ['id', 'slug', 'code', 'value', 'key'];

    let text = null;
    for (const p of textProps) if (p in item && item[p]) { text = item[p]; break; }
    if (!text) {
      for (const k of Object.keys(item)) {
        if (typeof item[k] === 'string' && item[k].trim()) { text = item[k]; break; }
      }
    }

    let value = null;
    for (const p of valueProps) if (p in item && (item[p] !== undefined && item[p] !== null)) { value = item[p]; break; }

    if (value === null) value = text !== null && text !== undefined ? text : JSON.stringify(item);
    return { text: String(text || value), value: String(value) };
  }

  function populateSelect(selectEl, items, placeholderText) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    ph.disabled = true;
    ph.selected = true;
    ph.textContent = placeholderText || 'Selecciona una opción';
    selectEl.appendChild(ph);

    (items || []).forEach(item => {
      const { text, value } = optionTextAndValue(item);
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = text;
      selectEl.appendChild(opt);
    });

    selectEl.disabled = false;
  }

  function setLoading(selectEl, isLoading) {
    if (!selectEl) return;
    selectEl.disabled = isLoading;
    if (isLoading) {
      selectEl.innerHTML = '';
      const ph = document.createElement('option');
      ph.value = '';
      ph.disabled = true;
      ph.selected = true;
      ph.textContent = 'Cargando...';
      selectEl.appendChild(ph);
    }
  }

  // Load genders and document types
  function loadLists() {
    setLoading(genderSelect, true);
    setLoading(docTypeSelect, true);

    const pGenders = fetch(GENDERS_API, { credentials: 'same-origin' })
      .then(r => { if (!r.ok) throw new Error('Genders fetch failed'); return r.json(); })
      .then(json => extractArrayFromResponse(json))
      .catch(() => null);

    const pDocTypes = fetch(DOC_TYPES_API, { credentials: 'same-origin' })
      .then(r => { if (!r.ok) throw new Error('Doc types fetch failed'); return r.json(); })
      .then(json => extractArrayFromResponse(json))
      .catch(() => null);

    Promise.all([pGenders, pDocTypes])
      .then(([gendersRes, docsRes]) => {
        gendersArray = Array.isArray(gendersRes) ? gendersRes : [];
        docTypesArray = Array.isArray(docsRes) ? docsRes : [];

        if (gendersArray.length) {
          populateSelect(genderSelect, gendersArray, 'Selecciona una opción');
        } else {
          populateSelect(genderSelect, [
            { name: 'Femenino', id: 'female' },
            { name: 'Masculino', id: 'male' },
            { name: 'Otro', id: 'other' },
            { name: 'Prefiero no decir', id: 'no_answer' }
          ], 'Selecciona una opción');
        }

        if (docTypesArray.length) {
          populateSelect(docTypeSelect, docTypesArray, 'Selecciona una opción');
        } else {
          populateSelect(docTypeSelect, [
            { name: 'Cédula de ciudadanía', id: 'cc' },
            { name: 'Cédula de extranjería', id: 'ce' },
            { name: 'Pasaporte', id: 'passport' },
            { name: 'Otro', id: 'other' }
          ], 'Selecciona una opción');
        }
      })
      .finally(() => {
        setLoading(genderSelect, false);
        setLoading(docTypeSelect, false);
      });
  }

  loadLists();

  // Resolve numeric id from select value or from previously loaded arrays
  function resolveIdFromSelectValue(selectEl, arrayLookup) {
    if (!selectEl || !selectEl.value) return undefined;
    const raw = selectEl.value;

    // If numeric string, return number
    if (/^\d+$/.test(raw)) return Number(raw);

    // Try to find by matching text/name in lookup array
    if (Array.isArray(arrayLookup) && arrayLookup.length) {
      const found = arrayLookup.find(item => {
        const text = (item.name || item.nombre || item.label || item.title || item.descripcion || item.description || '').toString().toLowerCase();
        return text === raw.toString().toLowerCase() || String(item.id) === String(raw) || String(item.value) === String(raw);
      });
      if (found && (found.id || found.value || found.key)) return Number(found.id || found.value || found.key);
    }

    // If it is a non-numeric code, return undefined (server will ignore optional)
    return undefined;
  }

  // Form submit
  if (!form) {
    console.warn('registerClientForm not found in DOM.');
    return;
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    showError('');

    // Client-side mandatory fields check
    const firstName = (form.firstName && form.firstName.value || '').trim();
    const lastName = (form.lastName && form.lastName.value || '').trim();
    const email = (form.email && form.email.value || '').trim();
    const username = (form.username && form.username.value || '').trim();

    if (!firstName || !lastName || !email || !username) {
      showError('Completa los campos obligatorios: Nombre, Apellido, Correo y Nombre de usuario.');
      return;
    }

    if (!password || !passwordConfirm) {
      showError('Campos de contraseña no encontrados.');
      return;
    }

    if (!password.value || !passwordConfirm.value) {
      showError('Ingresa contraseña y confirma.');
      return;
    }

    if (password.value.length < 8) {
      showError('La contraseña debe tener al menos 8 caracteres.');
      password.focus();
      return;
    }

    if (password.value !== passwordConfirm.value) {
      showError('Las contraseñas no coinciden.');
      password.focus();
      return;
    }

    if (acceptTerms && !acceptTerms.checked) {
      showError('Debes aceptar los términos y condiciones.');
      return;
    }

    // Resolve optional ids
    const genderId = resolveIdFromSelectValue(genderSelect, gendersArray);
    const documentTypeId = resolveIdFromSelectValue(docTypeSelect, docTypesArray);

    // Build payload plano (no wrapper) para que Joi acepte
    const payload = {
      roleId: Number(CLIENTE_ROLE_ID),
      firstName,
      lastName,
      email,
      username,
      password: password.value
    };

    if (genderId) payload.genderId = genderId;
    if (documentTypeId) payload.documentTypeId = documentTypeId;
    if (form.dob && form.dob.value) payload.birthDate = form.dob.value; // expected YYYY-MM-DD
    if (form.docNumber && form.docNumber.value) payload.documentNumber = form.docNumber.value.trim();

    // Send request
    try {
      if (submitBtn) submitBtn.disabled = true;
      const res = await fetch(REGISTER_API, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload) // << payload plano, no wrapper
      });

      const json = await res.json().catch(() => null);

      if (res.ok) {
        // success: redirect (ajusta la ruta según tu flujo)
        window.location.href = '/app/v1/auth/login';
        return;
      }

      // Parse and display server error (Joi/Boom)
      if (json) {
        const boomMsg = json.message || (json.output && json.output.payload && json.output.payload.message);
        if (boomMsg) {
          showError(boomMsg);
        } else if (json.error) {
          showError(json.error);
        } else {
          showError(JSON.stringify(json));
        }
      } else {
        showError('Error al registrar el usuario. Intenta nuevamente.');
      }
    } catch (err) {
      console.error(err);
      showError('Error de red al intentar registrar el usuario.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});