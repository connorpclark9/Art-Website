/* ============================================
   KINDRED SEAL — Artists Browse Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('artists-grid');
  KindredSeal.showSkeleton(grid, 'artist-card', 4);

  const artists = await KindredSeal.fetchJSON('data/artists.json');
  if (!artists) return;

  const html = artists.map((artist, i) => `
    <div class="artist-card animate-on-scroll animate-delay-${(i % 2) + 1}">
      <a href="artist.html?id=${artist.id}" class="artist-card__link">
        <div class="artist-card__image-wrapper">
          <img src="${artist.portraitImage}" alt="Portrait of ${artist.name}" class="artist-card__image" loading="lazy">
        </div>
        <div class="artist-card__body">
          <p class="artist-card__medium">${artist.medium}</p>
          <h2 class="artist-card__name">${artist.name}</h2>
          <p class="artist-card__tagline">${artist.tagline}</p>
        </div>
      </a>
    </div>
  `).join('');

  KindredSeal.hideSkeleton(grid, html);
});
