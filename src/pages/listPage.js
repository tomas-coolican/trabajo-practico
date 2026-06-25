import { fetchCharacters } from '../services/api.js';
import { createCharacterCard } from '../components/CharacterCard.js';
import { renderStatusMessage } from '../components/StatusMessage.js';
import { renderPagination } from '../components/Pagination.js';

const grid = document.getElementById('character-grid');
const statusEl = document.getElementById('status-message');
const paginationEl = document.getElementById('pagination');

let currentPage = 1;
let totalPages = 1;
let currentParams = {};

export async function loadCharacters(params = {}) {
  currentParams = params;
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
      return;
    }

    statusEl.innerHTML = '';
    totalPages = data.info.pages;

    data.results.forEach((character) => {
      grid.appendChild(createCharacterCard(character));
    });

    renderPagination(paginationEl, {
      currentPage,
      totalPages,
      onPageChange: (page) => {
        loadCharacters({ ...currentParams, page });
      },
    });
  } catch (error) {
    renderStatusMessage(statusEl, {
      type: 'error',
      message: error.message,
      onRetry: () => loadCharacters(params),
    });
  }
}
