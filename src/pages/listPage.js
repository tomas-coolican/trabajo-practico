import { fetchCharacters, fetchCharactersByIds } from '../services/api.js';
import { createCharacterCard } from '../components/CharacterCard.js';
import { renderStatusMessage } from '../components/StatusMessage.js';
import { renderPagination } from '../components/Pagination.js';
import { getFavorites } from '../utils/favorites.js';

const grid = document.getElementById('character-grid');
const statusEl = document.getElementById('status-message');
const paginationEl = document.getElementById('pagination');

const SORT_LABELS = {
  asc: 'Orden A-Z',
  desc: 'Orden Z-A',
  none: 'Sin orden',
};

let filters = {};
let currentPage = 1;
let totalPages = 1;
let currentResults = [];
let sortOrder = null;
let favoritesOnly = false;

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function renderCharacters(characters) {
  grid.innerHTML = '';
  characters.forEach((character) => {
    grid.appendChild(createCharacterCard(character, onFavToggle));
  });
}

function applySort(results, order) {
  const copy = [...results];
  if (order === null) return copy;

  // Ordena una copia para mantener intactos los datos originales de la API.
  copy.sort((a, b) => {
    const cmp = a.name.localeCompare(b.name);
    return order === 'asc' ? cmp : -cmp;
  });
  return copy;
}

function onFavToggle(id, nowFavorite) {
  // Si se quita un favorito mientras se ve esa lista, se recarga para sacarlo de pantalla.
  if (favoritesOnly && !nowFavorite) {
    loadFavoriteCharacters();
  }
}

function disableControls(disabled) {
  const controls = [
    document.getElementById('search'),
    document.getElementById('status-filter'),
  ];
  controls.forEach((el) => {
    if (el) el.disabled = disabled;
  });
}

async function loadFavoriteCharacters() {
  disableControls(true);

  renderStatusMessage(statusEl, { type: 'loading' });
  grid.innerHTML = '';
  paginationEl.innerHTML = '';

  const ids = getFavorites();

  if (ids.length === 0) {
    renderStatusMessage(statusEl, {
      type: 'empty',
      message: 'No tenés personajes favoritos todavía. Hacé clic en la estrella ★ para agregar.',
    });
    currentResults = [];
    return;
  }

  try {
    // La API permite pedir varios personajes en una sola request usando ids separados por coma.
    const results = await fetchCharactersByIds(ids);
    statusEl.innerHTML = '';
    currentResults = Array.isArray(results) ? results : [results];

    const sorted = applySort(currentResults, sortOrder);
    renderCharacters(sorted);
  } catch (error) {
    renderStatusMessage(statusEl, {
      type: 'error',
      message: error.message,
      onRetry: loadFavoriteCharacters,
    });
  }
}

export async function loadCharacters(overrides = {}) {
  // Los overrides permiten reutilizar el loader para paginacion sin perder filtros activos.
  const params = { ...filters, ...overrides };
  currentPage = params.page || 1;

  renderStatusMessage(statusEl, { type: 'loading' });
  grid.innerHTML = '';
  paginationEl.innerHTML = '';

  try {
    const data = await fetchCharacters({ ...params, page: currentPage });

    if (data.results.length === 0) {
      renderStatusMessage(statusEl, {
        type: 'empty',
        message: 'No se encontraron personajes con esos criterios.',
      });
      currentResults = [];
      return;
    }

    statusEl.innerHTML = '';
    totalPages = data.info.pages;
    currentResults = data.results;

    const sorted = applySort(currentResults, sortOrder);
    renderCharacters(sorted);

    renderPagination(paginationEl, {
      currentPage,
      totalPages,
      onPageChange: (page) => loadCharacters({ page }),
    });
  } catch (error) {
    renderStatusMessage(statusEl, {
      type: 'error',
      message: error.message,
      onRetry: () => loadCharacters(overrides),
    });
  }
}

function setupEvents() {
  const searchInput = document.getElementById('search');
  const statusFilter = document.getElementById('status-filter');
  const sortToggle = document.getElementById('sort-toggle');
  const favToggle = document.getElementById('favorites-toggle');

  if (searchInput) {
    const onSearch = debounce((value) => {
      if (favoritesOnly) return;

      // Al cambiar criterios se vuelve a la primera pagina para evitar resultados desfasados.
      filters.name = value || undefined;
      loadCharacters({ page: 1 });
    }, 300);

    searchInput.addEventListener('input', (e) => onSearch(e.target.value));
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      if (favoritesOnly) return;

      filters.status = e.target.value || undefined;
      loadCharacters({ page: 1 });
    });
  }

  if (sortToggle) {
    sortToggle.addEventListener('click', () => {
      const next = { asc: 'desc', desc: null, null: 'asc' };
      sortOrder = next[sortOrder];

      sortToggle.textContent = SORT_LABELS[sortOrder ?? 'none'];
      sortToggle.classList.toggle('btn--active', sortOrder !== null);

      if (currentResults.length > 0) {
        renderCharacters(applySort(currentResults, sortOrder));
      }
    });
  }

  if (favToggle) {
    favToggle.addEventListener('click', () => {
      favoritesOnly = !favoritesOnly;
      favToggle.classList.toggle('btn--active', favoritesOnly);

      if (favoritesOnly) {
        loadFavoriteCharacters();
      } else {
        disableControls(false);
        loadCharacters({ page: 1 });
      }
    });
  }
}

export function initListPage() {
  loadCharacters();
  setupEvents();
}
