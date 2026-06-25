export function createCharacterCard(character, isFavorite = false) {
  const card = document.createElement('article');
  card.className = 'card';

  const statusClass = `card__status-dot--${character.status.toLowerCase()}`;

  card.innerHTML = `
    <img class="card__image" src="${character.image}" alt="${character.name}" loading="lazy" />
    <button class="card__favorite ${isFavorite ? 'card__favorite--active' : ''}" data-id="${character.id}">
      ${isFavorite ? '★' : '☆'}
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

  card.addEventListener('click', (e) => {
    if (e.target.closest('.card__favorite')) return;
    window.location.href = `details.html?id=${character.id}`;
  });

  return card;
}
