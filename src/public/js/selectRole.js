// src/public/js/selectRole.js
// Pobla el select con roles y redirige según la selección:
// - "anunciante" -> /app/v1/auth/register/advertiser
// - "cliente"    -> /app/v1/auth/register/customer

document.addEventListener('DOMContentLoaded', () => {
  const API = '/app/v1/roles//list-all'; // ajustar si tu endpoint real difiere
  const select = document.getElementById('roleSelect');
  const nextBtn = document.getElementById('nextBtn');

  function enableNextIfSelected() {
    nextBtn.disabled = !select.value;
  }

  function mapRoleToPath(roleTextOrValue) {
    const v = String(roleTextOrValue || '').toLowerCase();
    if (v.includes('anunciante') || v.includes('advertiser')) {
      return '/app/v1/auth/register/advertiser';
    }
    if (v.includes('cliente') || v.includes('client') || v.includes('customer')) {
      return '/app/v1/auth/register/customer';
    }
    // Fallback: pasar el role como query param (si no coincide)
    return '/app/v1/auth/register?role=' + encodeURIComponent(roleTextOrValue);
  }

  function populateOptions(roles) {
    // roles: array de objetos; intentamos leer .name, .tipo_rol o fallback a string
    const filtered = (roles || []).filter(r => {
      const name = (r && (r.name || r.tipo_rol || r.role || r)) || '';
      return /anunciante|cliente|advertiser|customer/i.test(String(name));
    });

    // Si no encontramos nada, ponemos fallback manual
    if (!filtered.length) {
      const fallback = [
        { name: 'Anunciante' },
        { name: 'Cliente' }
      ];
      populateOptions(fallback);
      return;
    }

    // Limpiar el select (dejando la opción placeholder)
    // Mantener primero la opción disabled/placeholder si existe
    const placeholderOption = select.querySelector('option[disabled]') || null;
    select.innerHTML = '';
    if (placeholderOption) {
      placeholderOption.selected = true;
      select.appendChild(placeholderOption);
    } else {
      const ph = document.createElement('option');
      ph.value = '';
      ph.disabled = true;
      ph.selected = true;
      ph.textContent = 'Selecciona una opción';
      select.appendChild(ph);
    }

    filtered.forEach(r => {
      const name = r && (r.name || r.tipo_rol || r.role || String(r));
      const opt = document.createElement('option');
      opt.value = String(name).trim();
      opt.textContent = String(name).trim();
      select.appendChild(opt);
    });

    enableNextIfSelected();
  }

  // Fetch roles desde el API
  fetch(API, { credentials: 'same-origin' })
    .then(res => {
      if (!res.ok) throw new Error('Error al obtener roles');
      return res.json();
    })
    .then(data => {
      // Normalizar: la API puede devolver { roles: [...] } o [...] o { data: [...] }
      let rolesArray = [];
      if (Array.isArray(data)) rolesArray = data;
      else if (Array.isArray(data.roles)) rolesArray = data.roles;
      else if (Array.isArray(data.data)) rolesArray = data.data;
      else if (data && typeof data === 'object') {
        // Buscar la primera propiedad que sea array
        for (const k of Object.keys(data)) {
          if (Array.isArray(data[k])) {
            rolesArray = data[k];
            break;
          }
        }
      }

      populateOptions(rolesArray);
    })
    .catch(() => {
      // Fallback si falla la llamada: agregar manualmente Anunciante y Cliente
      populateOptions([{ name: 'Anunciante' }, { name: 'Cliente' }]);
    });

  // Events
  select.addEventListener('change', enableNextIfSelected);

  nextBtn.addEventListener('click', () => {
    const selectedValue = select.value || (select.selectedOptions[0] && select.selectedOptions[0].textContent);
    if (!selectedValue) return;

    const target = mapRoleToPath(selectedValue);
    // Redirigir
    window.location.href = target;
  });

  // Permitir submit con Enter cuando el select tenga focus (opcional)
  select.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && select.value) {
      ev.preventDefault();
      nextBtn.click();
    }
  });
});