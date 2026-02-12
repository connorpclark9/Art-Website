/* ============================================
   KINDRED SEAL — Homepage Logic
   Loads featured artists, artworks, journal
   and initializes the hero carousel
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  // Show skeletons
  const artistsGrid = document.getElementById('featured-artists-grid');
  const artworkGrid = document.getElementById('featured-artwork-grid');
  const journalGrid = document.getElementById('journal-teaser-grid');

  KindredSeal.showSkeleton(artistsGrid, 'artist-card', 4);
  KindredSeal.showSkeleton(artworkGrid, 'artwork-card', 6);
  KindredSeal.showSkeleton(journalGrid, 'journal-card', 2);

  // Fetch all data in parallel
  const [artists, artworks, journal] = await Promise.all([
    KindredSeal.fetchJSON('data/artists.json'),
    KindredSeal.fetchJSON('data/artworks.json'),
    KindredSeal.fetchJSON('data/journal.json')
  ]);

  // --- Hero Carousel ---
  if (artworks) {
    const featured = artworks
      .filter(a => a.featured)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
      .slice(0, 5);

    const track = document.getElementById('hero-carousel-track');
    if (track && featured.length > 0) {
      track.innerHTML = featured.map((artwork, i) => `
        <div class="carousel__slide ${i === 0 ? 'is-active' : ''}">
          <img src="${artwork.mainImage}" alt="${artwork.title} by ${artwork.artistName}" class="carousel__slide-image" loading="${i === 0 ? 'eager' : 'lazy'}">
        </div>
      `).join('');

      // Init carousel
      const heroSection = document.querySelector('.hero');
      new HeroCarousel(heroSection);
    }
  }

  // --- Featured Artists ---
  if (artists) {
    const featured = artists
      .filter(a => a.featured)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
      .slice(0, 4);

    const html = featured.map((artist, i) => `
      <div class="card animate-on-scroll animate-delay-${i + 1}">
        <a href="artist.html?id=${artist.id}" class="card__link">
          <div class="card__image-wrapper">
            <img src="${artist.portraitImage}" alt="Portrait of ${artist.name}" class="card__image" loading="lazy">
          </div>
          <div class="card__body">
            <p class="card__subtitle">${artist.medium}</p>
            <h3 class="card__title">${artist.name}</h3>
            <p class="card__text">${artist.tagline}</p>
          </div>
        </a>
      </div>
    `).join('');

    KindredSeal.hideSkeleton(artistsGrid, html);
  }

  // --- Featured Artwork ---
  if (artworks) {
    const featured = artworks
      .filter(a => a.featured && a.status === 'available')
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
      .slice(0, 6);

    const html = featured.map((artwork, i) => `
      <div class="card animate-on-scroll animate-delay-${(i % 3) + 1}">
        <a href="artwork.html?id=${artwork.id}" class="card__link">
          <div class="card__image-wrapper" style="aspect-ratio: 1;">
            <img src="${artwork.mainImage}" alt="${artwork.title} by ${artwork.artistName}" class="card__image" loading="lazy">
          </div>
          <div class="card__body">
            <p class="card__subtitle">${artwork.artistName}</p>
            <h3 class="card__title" style="font-size: var(--text-lg);">${artwork.title}</h3>
            <p class="artwork-card__story-teaser">${KindredSeal.truncate(artwork.story, 120)}</p>
          </div>
        </a>
      </div>
    `).join('');

    KindredSeal.hideSkeleton(artworkGrid, html);
  }

  // --- Journal Teaser ---
  if (journal) {
    const recent = journal.slice(0, 2);

    const html = recent.map((post, i) => `
      <a href="post.html?id=${post.id}" class="journal-teaser__card animate-on-scroll animate-delay-${i + 1}">
        <img src="${post.featuredImage}" alt="${post.title}" class="journal-teaser__image" loading="lazy">
        <div class="journal-teaser__body">
          <div class="journal-teaser__meta">
            <span class="badge">${post.category}</span>
            <span class="journal-teaser__date">${KindredSeal.formatDate(post.date)}</span>
          </div>
          <h3 class="journal-teaser__title">${post.title}</h3>
        </div>
      </a>
    `).join('');

    KindredSeal.hideSkeleton(journalGrid, html);
  }
});
