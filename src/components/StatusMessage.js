export function renderStatusMessage(container, { type, message, onRetry }) {
  container.innerHTML = '';

  const div = document.createElement('div');
  div.className = `status-message status-message--${type}`;

  if (type === 'loading') {
    div.innerHTML = '<div class="spinner"></div><p>Cargando personajes...</p>';
  } else if (type === 'error') {
    div.innerHTML = `<p>${message}</p>`;
    if (onRetry) {
      const btn = document.createElement('button');
      btn.className = 'btn btn--primary';
      btn.textContent = 'Reintentar';
      btn.addEventListener('click', onRetry);
      div.appendChild(btn);
    }
  } else if (type === 'empty') {
    div.innerHTML = `<p>${message || 'No se encontraron personajes.'}</p>`;
  }

  container.appendChild(div);
}
