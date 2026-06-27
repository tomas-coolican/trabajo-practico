const STORAGE_KEY = 'rm-favorites';

export function getFavorites() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    // Si localStorage tiene datos corruptos, la app sigue funcionando con una lista vacia.
    return [];
  }
}

export function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  const wasFavorite = index !== -1;

  if (!wasFavorite) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  return !wasFavorite;
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}
