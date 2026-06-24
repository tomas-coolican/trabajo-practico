import '../styles/global.css';
import { fetchCharacters } from './api/api.js';

async function init() {
  try {
    const data = await fetchCharacters();
    console.log('Personajes cargados:', data);
  } catch (error) {
    console.error('Error al cargar personajes:', error.message);
  }
}

init();
