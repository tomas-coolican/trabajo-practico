import './styles/global.css';
import { loadCharacterDetail } from './pages/detailPage.js';

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!id) {
  const statusEl = document.getElementById('status-message');
  statusEl.innerHTML = '<p>No se especificó un personaje.</p>';
} else {
  loadCharacterDetail(Number(id));
}