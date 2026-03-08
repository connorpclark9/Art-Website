/* ============================================
   KINDRED SEAL — Gallery Browse Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('gallery-grid');
  const filtersContainer = document.querySelector('.gallery__filters');

  KindredSeal.showSkeleton(grid, 'artwork-card', 9);

  const artworks = await KindredSeal.fetchJSON('data/artworks.json');
  if (!artworks) return;

  // Only show available works, sorted by year descending
  const sorted = artworks
    .filter(a => a.status === 'available')
    .sort((a, b) => b.year - a.year);

  // Build artist filter buttons from available works only
  const artistNames = [...new Set(sorted.map(a => a.artistName))];
  artistNames.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'gallery__filter';
    btn.dataset.filter = name;
    btn.textContent = name;
    filtersContainer.appendChild(btn);
  });

  // Render gallery
  function renderGallery(filter) {
    const filtered = filter === 'all'
      ? sorted
      : sorted.filter(a => a.artistName === filter);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="gallery-empty">
          <p>No artwork found for this filter.</p>
        </div>
      `;
      return;
    }

    const html = filtered.map((work, i) => `
        <div class="gallery-card animate-on-scroll animate-delay-${(i % 3) + 1}">
          <a href="artwork.html?id=${work.id}" class="gallery-card__link">
            <div class="gallery-card__image-wrapper">
              <img src="${work.mainImage}" alt="${work.title}" class="gallery-card__image" loading="lazy">
            </div>
            <div class="gallery-card__body">
              <p class="gallery-card__artist">${work.artistName}</p>
              <p class="gallery-card__title">${work.title}</p>
              <p class="gallery-card__meta">${work.medium}</p>
            </div>
          </a>
        </div>
      `).join('');

    KindredSeal.hideSkeleton(grid, html);
  }

  // Initial render
  renderGallery('all');

  // Filter click handling
  filtersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.gallery__filter');
    if (!btn) return;

    filtersContainer.querySelectorAll('.gallery__filter').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    const filter = btn.dataset.filter;
    renderGallery(filter);
  });
});
