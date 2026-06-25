export function renderPagination(container, { currentPage, totalPages, onPageChange }) {
  container.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.className = 'pagination__btn';
  prevBtn.textContent = '← Anterior';
  prevBtn.disabled = currentPage <= 1;
  prevBtn.addEventListener('click', () => onPageChange(currentPage - 1));

  const info = document.createElement('span');
  info.className = 'pagination__info';
  info.textContent = `Página ${currentPage} de ${totalPages}`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'pagination__btn';
  nextBtn.textContent = 'Siguiente →';
  nextBtn.disabled = currentPage >= totalPages;
  nextBtn.addEventListener('click', () => onPageChange(currentPage + 1));

  container.appendChild(prevBtn);
  container.appendChild(info);
  container.appendChild(nextBtn);
}
