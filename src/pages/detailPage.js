import { fetchCharacterById } from '../services/api.js';
import { renderStatusMessage } from '../components/StatusMessage.js';
import { isFavorite, toggleFavorite } from '../utils/favorites.js';

const detailEl = document.getElementById('character-detail');
const statusEl = document.getElementById('status-message');

function renderDetail(character) {
  const fav = isFavorite(character.id);
  const episodesCount = character.episode.length;

  detailEl.innerHTML = `
    <img class="detail__image" src="${character.image}" alt="${character.name}" />
    <div class="detail__info">
      <h2>${character.name}</h2>
      <button class="btn detail__fav-btn ${fav ? 'btn--active' : ''}">
        ${fav ? '★' : '☆'} ${fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      </button>
      <p><strong>Estado:</strong> ${character.status}</p>
      <p><strong>Especie:</strong> ${character.species}</p>
      <p><strong>Género:</strong> ${character.gender}</p>
      <p><strong>Origen:</strong> ${character.origin.name}</p>
      <p><strong>Ubicación:</strong> ${character.location.name}</p>
      <div class="detail__episodes">
        <h3>Episodios (${episodesCount})</h3>
        <p>Aparece en ${episodesCount} episodio${episodesCount !== 1 ? 's' : ''}.</p>
      </div>
    </div>
  `;

  detailEl.querySelector('.detail__fav-btn').addEventListener('click', () => {
    // Se actualiza solo el boton para evitar volver a renderizar todo el detalle.
    const nowFavorite = toggleFavorite(character.id);
    const btn = detailEl.querySelector('.detail__fav-btn');
    btn.textContent = nowFavorite ? '★ Quitar de favoritos' : '☆ Agregar a favoritos';
    btn.classList.toggle('btn--active', nowFavorite);
  });
}

export async function loadCharacterDetail(id) {
  renderStatusMessage(statusEl, { type: 'loading' });
  detailEl.innerHTML = '';

  try {
    const character = await fetchCharacterById(id);
    statusEl.innerHTML = '';
    renderDetail(character);
  } catch (error) {
    renderStatusMessage(statusEl, {
      type: 'error',
      message: error.message,
      onRetry: () => loadCharacterDetail(id),
    });
  }
}
