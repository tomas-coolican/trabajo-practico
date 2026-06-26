import { fetchCharacters } from '../services/api.js';
import { createCharacterCard } from '../components/CharacterCard.js';
import { renderStatusMessage } from '../components/StatusMessage.js';
import { renderPagination } from '../components/Pagination.js';

const grid = document.getElementById('character-grid');
const statusEl = document.getElementById('status-message');
const paginationEl = document.getElementById('pagination');

let filters = {};
let currentPage = 1;
let totalPages = 1;
let currentResults = [];
let sortOrder = 'asc';

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
    grid.appendChild(createCharacterCard(character));
  });
}

function applySort(results, order) {
  const sorted = [...results];
  sorted.sort((a, b) => {
    const cmp = a.name.localeCompare(b.name);
    return order === 'asc' ? cmp : -cmp;
  });
  return sorted;
}

export async function loadCharacters(overrides = {}) {
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

  if (searchInput) {
    const onSearch = debounce((value) => {
      filters.name = value || undefined;
      loadCharacters({ page: 1 });
    }, 300);

    searchInput.addEventListener('input', (e) => onSearch(e.target.value));
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      filters.status = e.target.value || undefined;
      loadCharacters({ page: 1 });
    });
  }

  if (sortToggle) {
    sortToggle.addEventListener('click', () => {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      sortToggle.textContent = sortOrder === 'asc' ? 'Ordenar A-Z' : 'Ordenar Z-A';
      sortToggle.classList.toggle('btn--active');

      if (currentResults.length > 0) {
        renderCharacters(applySort(currentResults, sortOrder));
      }
    });
  }
}

loadCharacters();
setupEvents();
