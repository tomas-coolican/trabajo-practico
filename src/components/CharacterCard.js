import { toggleFavorite, isFavorite } from '../utils/favorites.js';

export function createCharacterCard(character, onToggle = null) {
  const card = document.createElement('article');
  card.className = 'card';

  const fav = isFavorite(character.id);
  const statusClass = `card__status-dot--${character.status.toLowerCase()}`;

  card.innerHTML = `
    <img class="card__image" src="${character.image}" alt="${character.name}" loading="lazy" />
    <button class="card__favorite ${fav ? 'card__favorite--active' : ''}" data-id="${character.id}">
      ${fav ? '★' : '☆'}
    </button>
    <div class="card__body">
      <h3 class="card__name">${character.name}</h3>
      <div class="card__info">
        <span class="card__status">
          <span class="card__status-dot ${statusClass}"></span>
          ${character.status}
        </span>
        — ${character.species}
      </div>
    </div>
  `;

  card.querySelector('.card__favorite').addEventListener('click', (e) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const id = Number(btn.dataset.id);
    const nowFavorite = toggleFavorite(id);
    btn.textContent = nowFavorite ? '★' : '☆';
    btn.classList.toggle('card__favorite--active', nowFavorite);
    if (onToggle) onToggle(id, nowFavorite);
  });

  card.addEventListener('click', (e) => {
    if (e.target.closest('.card__favorite')) return;
    window.location.href = `details.html?id=${character.id}`;
  });

  return card;
}
