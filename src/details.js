import './styles/global.css';
import { fetchCharacterById } from './services/api.js';

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    console.error('No se proporcionó un ID de personaje.');
    return;
  }

  try {
    const character = await fetchCharacterById(Number(id));
    console.log('Personaje cargado:', character);
  } catch (error) {
    console.error('Error al cargar personaje:', error.message);
  }
}

init();
