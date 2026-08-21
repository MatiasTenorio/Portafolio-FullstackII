/* =========================================================================
   PORTAFOLIO — Matías Tenorio
   JavaScript vanilla (sin frameworks, sin backend).
   Todo lo que el usuario carga o edita (foto de perfil, proyectos) se
   guarda en localStorage para que quede al recargar la página.
   ========================================================================= */

/* -------------------------------------------------------------------------
   1) EFECTO DE ESCRITURA EN LA LÍNEA DE ARRANQUE (terminal)
   ------------------------------------------------------------------------- */
(function bootTypewriter() {
  const el = document.getElementById('boot-text');
  const message = 'whoami --portafolio';
  let i = 0;

  function type() {
    if (i <= message.length) {
      el.textContent = message.slice(0, i);
      i++;
      setTimeout(type, 38);
    }
  }
  type();
})();


/* -------------------------------------------------------------------------
   2) FOTO DE PERFIL (cargable, persistida en localStorage)
   ------------------------------------------------------------------------- */
const AVATAR_KEY = 'portafolio_avatar';

const avatarInput = document.getElementById('avatar-input');
const avatarImg = document.getElementById('avatar-img');
const avatarPlaceholder = document.getElementById('avatar-placeholder');

function setAvatar(dataUrl) {
  avatarImg.src = dataUrl;
  avatarImg.classList.remove('hidden');
  avatarPlaceholder.classList.add('hidden');
}

// Restaurar avatar guardado, si existe
const savedAvatar = localStorage.getItem(AVATAR_KEY);
if (savedAvatar) setAvatar(savedAvatar);

avatarInput.addEventListener('change', () => {
  const file = avatarInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    setAvatar(dataUrl);
    localStorage.setItem(AVATAR_KEY, dataUrl);
  };
  reader.readAsDataURL(file);
});


/* -------------------------------------------------------------------------
   3) AVISO ("toast") REUTILIZABLE
   ------------------------------------------------------------------------- */
const toastEl = document.getElementById('toast');
let toastTimer = null;

function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
}


/* -------------------------------------------------------------------------
   4) BOTÓN "COPIAR NÚMERO"
   ------------------------------------------------------------------------- */
const phoneBtn = document.getElementById('btn-phone');

phoneBtn.addEventListener('click', async () => {
  const phone = phoneBtn.dataset.phone;
  try {
    await navigator.clipboard.writeText(phone);
    showToast('Número copiado: ' + phone);
  } catch (err) {
    // Respaldo por si el navegador bloquea el portapapeles
    showToast('No se pudo copiar automáticamente. Número: ' + phone);
  }
});


/* -------------------------------------------------------------------------
   5) PROYECTOS: crear, editar, eliminar y persistir en localStorage
   ------------------------------------------------------------------------- */
const PROJECTS_KEY = 'portafolio_projects';

const projectsGrid = document.getElementById('projects-grid');
const projectTemplate = document.getElementById('project-card-template');
const addProjectBtn = document.getElementById('add-project-btn');

// Proyectos de ejemplo que se muestran la primera vez (antes de guardar nada)
const DEFAULT_PROJECTS = [
  {
    description: 'M3Tours — microservicios en Spring Boot desplegados en AWS ECS, con CI/CD en GitHub Actions y stack de observabilidad (Loki, Grafana, Prometheus).',
    link: 'https://github.com/MatiasTenorio',
    image: null
  }
];

// Genera un id simple para cada tarjeta de proyecto
function newId() {
  return 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function loadProjects() {
  const raw = localStorage.getItem(PROJECTS_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* datos corruptos, se ignoran */ }
  }
  return DEFAULT_PROJECTS.map(p => ({ id: newId(), ...p }));
}

function saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

// Estado en memoria de los proyectos actuales
let projects = loadProjects();

// Lee el estado actual directamente desde el DOM (para no perder ediciones
// en vivo del usuario antes de guardar)
function readProjectFromCard(card) {
  const img = card.querySelector('.project-image');
  return {
    id: card.dataset.id,
    description: card.querySelector('.project-desc').textContent.trim(),
    link: card.querySelector('.project-link-input').value.trim(),
    image: img.classList.contains('hidden') ? null : img.src
  };
}

function persistAllCards() {
  const cards = [...projectsGrid.querySelectorAll('.project-card')];
  projects = cards.map(readProjectFromCard);
  saveProjects(projects);
}

function renderProjectCard(data) {
  const node = projectTemplate.content.cloneNode(true);
  const card = node.querySelector('.project-card');
  card.dataset.id = data.id;

  const img = card.querySelector('.project-image');
  const placeholder = card.querySelector('.project-image-placeholder');
  const uploadInput = card.querySelector('.project-image-upload input');
  const descEl = card.querySelector('.project-desc');
  const linkInput = card.querySelector('.project-link-input');
  const visitBtn = card.querySelector('.btn-visit');
  const removeBtn = card.querySelector('.project-remove');

  // --- Imagen del proyecto -------------------------------------------
  if (data.image) {
    img.src = data.image;
    img.classList.remove('hidden');
    placeholder.classList.add('hidden');
  }

  uploadInput.addEventListener('change', () => {
    const file = uploadInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
      img.classList.remove('hidden');
      placeholder.classList.add('hidden');
      persistAllCards();
    };
    reader.readAsDataURL(file);
  });

  // --- Descripción editable --------------------------------------------
  descEl.textContent = data.description || '';
  descEl.addEventListener('blur', persistAllCards);

  // --- Link del proyecto -------------------------------------------------
  linkInput.value = data.link || '';
  visitBtn.href = data.link || '#';

  linkInput.addEventListener('input', () => {
    visitBtn.href = linkInput.value.trim() || '#';
  });
  linkInput.addEventListener('blur', persistAllCards);

  visitBtn.addEventListener('click', (e) => {
    if (!linkInput.value.trim()) {
      e.preventDefault();
      showToast('Agrega primero un link al proyecto');
    }
  });

  // --- Eliminar tarjeta --------------------------------------------------
  removeBtn.addEventListener('click', () => {
    card.remove();
    persistAllCards();
  });

  projectsGrid.appendChild(node);
}

function renderAllProjects() {
  projectsGrid.innerHTML = '';
  projects.forEach(renderProjectCard);
}

// Botón "+ Nuevo proyecto"
addProjectBtn.addEventListener('click', () => {
  const data = { id: newId(), description: '', link: '', image: null };
  renderProjectCard(data);
  persistAllCards();

  // Lleva el foco a la descripción de la tarjeta recién creada
  const cards = projectsGrid.querySelectorAll('.project-card');
  const lastCard = cards[cards.length - 1];
  lastCard.querySelector('.project-desc').focus();
});

renderAllProjects();
