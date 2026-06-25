import { fetchCharacterById } from '../services/api.js';
import { renderStatusMessage } from '../components/StatusMessage.js';

const detailEl = document.getElementById('character-detail');
const statusEl = document.getElementById('status-message');

export async function loadCharacterDetail(id) {
  renderStatusMessage(statusEl, { type: 'loading' });
  detailEl.innerHTML = '';

  try {
    const character = await fetchCharacterById(id);
    statusEl.innerHTML = '';

    const episodesCount = character.episode.length;

    detailEl.innerHTML = `
      <img class="detail__image" src="${character.image}" alt="${character.name}" />
      <div class="detail__info">
        <h2>${character.name}</h2>
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
  } catch (error) {
    renderStatusMessage(statusEl, {
      type: 'error',
      message: error.message,
      onRetry: () => loadCharacterDetail(id),
    });
  }
}
