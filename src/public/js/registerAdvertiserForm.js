// src/public/js/registerAdvertiser.js
// Carga selects de género y tipo de documento desde API y valida el formulario
// Endpoints usados (ajusta si tu API tiene una sola slash):
const GENDERS_API = '/app/v1/genders/list-all';
const DOC_TYPES_API = '/app/v1/document-types/list-all';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerAdvertiserForm');
  const submitBtn = document.getElementById('submitBtn');
  const acceptTerms = document.getElementById('acceptTerms');
  const password = document.getElementById('password');
  const passwordConfirm = document.getElementById('passwordConfirm');
  const formError = document.getElementById('formError');

  const genderSelect = document.getElementById('gender');
  const docTypeSelect = document.getElementById('docType');

  function showError(msg) {
    if (!formError) return;
    formError.textContent = msg;
    formError.style.display = msg ? 'block' : 'none';
  }

  function updateSubmitState() {
    submitBtn.disabled = !acceptTerms.checked;
  }

  acceptTerms.addEventListener('change', updateSubmitState);
  updateSubmitState();

  // Utilities (mismos helpers que en la versión cliente)
  function extractArrayFromResponse(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.roles)) return data.roles;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;
    for (const k of Object.keys(data || {})) {
      if (Array.isArray(data[k])) return data[k];
    }
    return [];
  }

  function optionTextAndValue(item, fallbacks = []) {
    if (item == null) return { text: String(item), value: String(item) };
    if (typeof item === 'string') return { text: item, value: item };

    const textCandidates = ['name','nombre','label','title','descripcion','description','display'];
    const valueCandidates = ['id','slug','code','value','key'];

    let text = null;
    for (const p of textCandidates) {
      if (p in item && item[p]) { text = item[p]; break; }
    }
    if (!text) {
      for (const k of Object.keys(item)) {
        if (typeof item[k] === 'string' && item[k].trim()) { text = item[k]; break; }
      }
    }
    if (!text && fallbacks.length) text = fallbacks[0];

    let value = null;
    for (const p of valueCandidates) {
      if (p in item && (item[p] !== undefined && item[p] !== null)) { value = item[p]; break; }
    }
    if (value === null) value = (text !== null && text !== undefined) ? text : JSON.stringify(item);

    return { text: String(text).trim(), value: String(value) };
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
      const { text, value } = optionTextAndValue(item, [placeholderText]);
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = text;
      selectEl.appendChild(opt);
    });

    selectEl.disabled = false;
  }

  const GENDERS_FALLBACK = [
    { name: 'Femenino', value: 'female' },
    { name: 'Masculino', value: 'male' },
    { name: 'Otro', value: 'other' },
    { name: 'Prefiero no decir', value: 'no_answer' }
  ];
  const DOC_TYPES_FALLBACK = [
    { name: 'Cédula de ciudadanía', value: 'cc' },
    { name: 'Cédula de extranjería', value: 'ce' },
    { name: 'Pasaporte', value: 'passport' },
    { name: 'Otro', value: 'other' }
  ];

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

  function loadLists() {
    setLoading(genderSelect, true);
    setLoading(docTypeSelect, true);

    const fetchGender = fetch(GENDERS_API, { credentials: 'same-origin' })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(json => extractArrayFromResponse(json))
      .catch(() => null);

    const fetchDocTypes = fetch(DOC_TYPES_API, { credentials: 'same-origin' })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(json => extractArrayFromResponse(json))
      .catch(() => null);

    Promise.all([fetchGender, fetchDocTypes])
      .then(([gendersArray, docsArray]) => {
        if (Array.isArray(gendersArray) && gendersArray.length) {
          populateSelect(genderSelect, gendersArray, 'Selecciona una opción');
        } else {
          populateSelect(genderSelect, GENDERS_FALLBACK.map(g => ({ name: g.name, value: g.value })), 'Selecciona una opción');
        }

        if (Array.isArray(docsArray) && docsArray.length) {
          populateSelect(docTypeSelect, docsArray, 'Selecciona una opción');
        } else {
          populateSelect(docTypeSelect, DOC_TYPES_FALLBACK.map(d => ({ name: d.name, value: d.value })), 'Selecciona una opción');
        }
      })
      .finally(() => {
        setLoading(genderSelect, false);
        setLoading(docTypeSelect, false);
      });
  }

  loadLists();

  // Validación en submit
  form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  showError('');

  // Validaciones básicas de campos obligatorios (manténlas)
  const requiredFields = [
    'firstName','lastName','dob','docNumber','email','username','password','passwordConfirm','businessName'
  ];
  for (const id of requiredFields) {
    const el = document.getElementById(id);
    if (el && !el.value) {
      showError('Por favor completa todos los campos obligatorios.');
      el.focus();
      return false;
    }
  }

  if (genderSelect && !genderSelect.value) {
    showError('Por favor selecciona tu género.');
    genderSelect.focus();
    return false;
  }

  if (docTypeSelect && !docTypeSelect.value) {
    showError('Por favor selecciona el tipo de documento.');
    docTypeSelect.focus();
    return false;
  }

  if (password && passwordConfirm) {
    if (password.value !== passwordConfirm.value) {
      showError('Las contraseñas no coinciden.');
      password.focus();
      return false;
    }
    if (password.value.length < 8) {
      showError('La contraseña debe tener al menos 8 caracteres.');
      password.focus();
      return false;
    }
  }

  if (!acceptTerms.checked) {
    showError('Debes aceptar los términos y condiciones para continuar.');
    return false;
  }

  // --- Construir payload compatible con userSchema ---
  // ADVERTISER ROLE ID — ajusta si en tu BD es otro
  const ADVERTISER_ROLE_ID = 2;

  const payload = {
    // enviar newUserData para evitar que el validador Joi rechace claves extra en root
    newUserData: {
      roleId: ADVERTISER_ROLE_ID,
      firstName: (document.getElementById('firstName') || {}).value || '',
      lastName: (document.getElementById('lastName') || {}).value || '',
      email: (document.getElementById('email') || {}).value || '',
      username: (document.getElementById('username') || {}).value || '',
      password: (document.getElementById('password') || {}).value || '',
      // mapear selects a los nombres esperados por el schema
      genderId: genderSelect && genderSelect.value ? Number(genderSelect.value) : undefined,
      documentTypeId: docTypeSelect && docTypeSelect.value ? Number(docTypeSelect.value) : undefined,
      documentNumber: (document.getElementById('docNumber') || {}).value || '',
      birthDate: (document.getElementById('dob') || {}).value || '' // YYYY-MM-DD
    },

    // datos del negocio dentro de "business" (no en root)
    business: {
      name: (document.getElementById('businessName') || {}).value || '',
      description: (document.getElementById('businessDescription') || {}).value || '',
      website: (document.getElementById('website') || {}).value || '',
      facebook: (document.getElementById('facebook') || {}).value || '',
      instagram: (document.getElementById('instagram') || {}).value || '',
      tiktok: (document.getElementById('tiktok') || {}).value || '',
      // locationId si lo usas: parseInt(...) o null
      // locationId: parseInt((document.getElementById('locationId')||{}).value) || undefined
    }
  };

  // Opcional: quitar claves undefined para un body más limpio
  if (!payload.newUserData.genderId) delete payload.newUserData.genderId;
  if (!payload.newUserData.documentTypeId) delete payload.newUserData.documentTypeId;
  if (!payload.newUserData.documentNumber) delete payload.newUserData.documentNumber;
  if (!payload.newUserData.birthDate) delete payload.newUserData.birthDate;

  // Si no quieres enviar business vacío, valida mínimo name
  if (!payload.business.name) {
    showError('El nombre del negocio es requerido para registrarse como anunciante.');
    document.getElementById('businessName').focus();
    return false;
  }

  // Deshabilitar botón mientras se procesa
  submitBtn.disabled = true;
  submitBtn.textContent = 'Registrando...';

  try {
    const CREATE_API = '/app/v1/users/create';
    const res = await fetch(CREATE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      // mostrar mensaje claro (si Joi devuelve detalles, úsalos)
      const msg = json.message || json.error || 'Error al crear el anunciante';
      showError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      return false;
    }

    // Éxito: redirigir o mostrar mensaje según tu flujo
    // Si tu API devuelve user y business, puedes redirigir a login o panel
    window.location.href = '/auth/success'; // ajustar a la ruta deseada

  } catch (err) {
    showError('Error de red al contactar al servidor. Intenta de nuevo.');
    console.error(err);
    return false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Registrarse';
  }
});
});