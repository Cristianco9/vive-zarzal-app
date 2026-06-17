document.addEventListener('DOMContentLoaded', () => {
  const endpoint = '/app/v1/services/list-all';
  const grid = document.getElementById('vz-grid');
  const emptyBox = document.getElementById('vz-empty');
  const searchInput = document.getElementById('vz-search-input');
  const searchBtn = document.getElementById('vz-search-btn');

  let services = [];

  // Fetch y render inicial (grid por defecto)
  fetch(endpoint)
    .then(r => r.json())
    .then(data => {
      if (!data || !data.services) throw new Error('No services returned');
      services = data.services;
      renderGrid(services);
    })
    .catch(err => {
      grid.innerHTML = `<p style="padding:20px;color:#a00">Error cargando servicios: ${err.message}</p>`;
      console.error(err);
    });

  // Búsqueda simple en client-side
  searchBtn.addEventListener('click', () => {
    applyFilter();
  });

  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') applyFilter();
  });

  function applyFilter() {
    const q = (searchInput.value || '').trim().toLowerCase();
    const filtered = services.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q) ||
      (s.category && s.category.name && s.category.name.toLowerCase().includes(q)) ||
      (s.business && s.business.name && s.business.name.toLowerCase().includes(q))
    );
    renderGrid(filtered);
  }

  // Render grid (matriz) — muestra todas las tarjetas en varias filas
  function renderGrid(list) {
    grid.innerHTML = '';
    emptyBox.style.display = 'none';

    if (!list || list.length === 0) {
      emptyBox.style.display = 'block';
      return;
    }

    const fragment = document.createDocumentFragment();
    list.forEach(s => fragment.appendChild(createCard(s)));
    grid.appendChild(fragment);
  }

  function createCard(s) {
    const card = document.createElement('article');
    card.className = 'vz-card';

    // IMAGEN: priorizamos s.imageUrl si existe, sino placeholder SVG
    const imgDiv = document.createElement('div');
    imgDiv.className = 'vz-card__img';
    if (s.imageUrl) {
      imgDiv.style.backgroundImage = `url("${s.imageUrl}")`;
    } else {
      const colors = ['#f2a93b','#77b36a','#4aa3d8','#d66ea0','#f28b6f'];
      const color = colors[s.id % colors.length] || '#ccc';
      const titleText = s.name || 'Servicio';
      const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='1000'><rect width='100%' height='100%' fill='${color}'/><text x='50%' y='50%' font-size='48' font-family='Arial' dominant-baseline='middle' text-anchor='middle' fill='#fff'>${escapeXml(titleText)}</text></svg>`);
      imgDiv.style.backgroundImage = `url("data:image/svg+xml;charset=UTF-8,${svg}")`;
    }
    imgDiv.style.backgroundSize = 'cover';
    imgDiv.style.backgroundPosition = 'center';

    // favorito (corazón)
    const fav = document.createElement('div');
    fav.className = 'vz-card__fav';
    // Si no usas FontAwesome, reemplaza innerHTML por un SVG
    fav.innerHTML = '<i class="fa-regular fa-heart"></i>';
    fav.addEventListener('click', (e) => {
      e.stopPropagation();
      fav.classList.toggle('liked');
      // opcional: guardar favorito en localStorage
      // saveFavState(s.id, fav.classList.contains('liked'));
    });

    imgDiv.appendChild(fav);

    // cuerpo
    const body = document.createElement('div');
    body.className = 'vz-card__body';

    const title = document.createElement('a');
    title.className = 'vz-card__title';
    title.href = `/services/${s.id}`;
    title.textContent = s.name;

    const desc = document.createElement('p');
    desc.className = 'vz-card__desc';
    desc.textContent = truncate(s.description || '', 120);

    const meta = document.createElement('div');
    meta.className = 'vz-card__meta';

    const left = document.createElement('div');
    left.className = 'vz-card__meta-left';

    const locIcon = document.createElement('i');
    locIcon.className = 'fa-solid fa-map-pin';
    locIcon.style.color = '#d33';
    locIcon.style.fontSize = '12px';

    const locationText = document.createElement('span');
    const bizName = (s.business && s.business.name) ? s.business.name : 'Ubicación';
    locationText.textContent = bizName;

    left.appendChild(locIcon);
    left.appendChild(locationText);

    const rating = document.createElement('div');
    rating.className = 'vz-card__rating';
    const simulated = (Math.round((4.6 + (s.id % 5) * 0.1) * 10) / 10).toFixed(1);
    rating.textContent = simulated;
    left.appendChild(rating);

    const right = document.createElement('div');
    const price = document.createElement('div');
    price.className = 'vz-price';
    price.textContent = formatCOP(s.price);
    right.appendChild(price);

    meta.appendChild(left);
    meta.appendChild(right);

    // montar
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(meta);

    card.appendChild(imgDiv);
    card.appendChild(body);

    return card;
  }

  // Helpers
  function formatCOP(val){
    const num = Number(val);
    if (isNaN(num)) return '';
    return num.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  }
  function truncate(text, n){
    if (!text) return '';
    if (text.length <= n) return text;
    return text.slice(0, n-1) + '…';
  }
  function escapeXml(unsafe) {
    return (unsafe || '').replace(/[&<>'"]/g, function (c) {
      switch (c) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case "'": return '&apos;';
        case '"': return '&quot;';
      }
    });
  }
});