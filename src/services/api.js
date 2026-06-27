const BASE_URL = 'https://rickandmortyapi.com/api';

async function request(endpoint, params = {}) {
  const query = new URLSearchParams();

  // Solo se envian parametros con valor real para no generar filtros invalidos en la API.
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();
  const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error('Error de conexión. Verificá tu conexión a internet.');
  }

  // En listados, la API responde 404 cuando no hay coincidencias; se transforma en estado vacio.
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Error del servidor (${response.status}). Intentalo de nuevo más tarde.`);
  }

  return response.json();
}

export async function fetchCharacters(params = {}) {
  const data = await request('/character', params);
  return data ?? { results: [], info: { pages: 0, count: 0 } };
}

export async function fetchCharacterById(id) {
  const data = await request(`/character/${id}`);
  if (!data) {
    throw new Error('Personaje no encontrado.');
  }
  return data;
}

export async function fetchCharactersByIds(ids) {
  if (ids.length === 0) return [];

  // La API devuelve un objeto para un solo id y un array para varios; se normaliza aqui.
  const data = await request(`/character/${ids.join(',')}`);
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}
