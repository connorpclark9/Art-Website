/* ============================================
   KINDRED SEAL — Artist Profile Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const artistId = KindredSeal.getQueryParam('id');
  if (!artistId) {
    showNotFound();
    return;
  }

  // Show skeletons
  const heroEl = document.getElementById('artist-hero');
  const storyEl = document.getElementById('artist-story-content');
  const processEl = document.getElementById('artist-process-content');
  const galleryEl = document.getElementById('artist-gallery');

  KindredSeal.showSkeleton(storyEl, 'text-block', 2);
  KindredSeal.showSkeleton(processEl, 'text-block', 1);

  // Fetch data
  const [artists, artworks] = await Promise.all([
    KindredSeal.fetchJSON('data/artists.json'),
    KindredSeal.fetchJSON('data/artworks.json')
  ]);

  if (!artists) return;

  const artist = artists.find(a => a.id === artistId);
  if (!artist) {
    showNotFound();
    return;
  }

  // --- Update Page Meta ---
  document.title = `${artist.name} — Artist Profile | Kindred Seal`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', `${artist.tagline}. Discover ${artist.name}'s story, creative process, and available work at Kindred Seal.`);

  // --- Hero ---
  heroEl.innerHTML = `
    <img src="${artist.heroImage}" alt="${artist.name}'s studio" class="artist-hero__image">
    <div class="artist-hero__overlay"></div>
    <div class="artist-hero__content container">
      <h1 class="artist-hero__name">${artist.name}</h1>
      <p class="artist-hero__tagline">${artist.tagline}</p>
    </div>
  `;

  // --- Story ---
  KindredSeal.hideSkeleton(storyEl, `
    <span class="artist-story__label">The Artist's Story</span>
    <div class="divider"></div>
    <div class="prose">${artist.story}</div>
  `);

  // --- Process ---
  KindredSeal.hideSkeleton(processEl, `
    <span class="artist-story__label">Creative Process</span>
    <div class="divider"></div>
    <div class="prose">${artist.processDescription}</div>
  `);

  // --- Artwork Gallery ---
  if (artworks) {
    const artistWorks = artworks.filter(a => a.artistId === artistId);
    const available = artistWorks.filter(a => a.status === 'available');
    const collected = artistWorks.filter(a => a.status === 'collected');

    let galleryHTML = '';

    if (available.length > 0) {
      galleryHTML += `
        <div class="artist-gallery__section animate-on-scroll">
          <h2 class="artist-gallery__heading">Available Works</h2>
          <div class="artist-gallery__grid">
            ${available.map(work => artworkThumbCard(work, false)).join('')}
          </div>
        </div>
      `;
    }

    if (collected.length > 0) {
      galleryHTML += `
        <div class="artist-gallery__section artist-gallery__section--collected animate-on-scroll">
          <h2 class="artist-gallery__heading">Collected</h2>
          <div class="artist-gallery__grid">
            ${collected.map(work => artworkThumbCard(work, true)).join('')}
          </div>
        </div>
      `;
    }

    if (galleryHTML) {
      galleryEl.innerHTML = `<div class="container">${galleryHTML}</div>`;
    }
  }

  // --- Inquiry CTA ---
  const inquiryEl = document.getElementById('artist-inquiry');
  const subject = `Inquiry about ${artist.name}'s work`;
  inquiryEl.innerHTML = `
    <div class="container">
      <h2 class="artist-inquiry__heading">Interested in ${artist.name}'s Work?</h2>
      <p class="artist-inquiry__text">
        We'd love to help you find the right piece. Reach out to start the conversation.
      </p>
      <a href="${KindredSeal.getInquiryEmail(subject)}" class="btn btn--primary">
        Email Us About ${artist.name}
      </a>
    </div>
  `;

  // Re-init scroll animations
  KindredSeal.initScrollAnimations();
});

function artworkThumbCard(work, isCollected) {
  return `
    <div class="artwork-thumb">
      <a href="artwork.html?id=${work.id}" class="artwork-thumb__link">
        <div class="artwork-thumb__image-wrapper">
          <img src="${work.mainImage}" alt="${work.title}" class="artwork-thumb__image" loading="lazy">
          ${isCollected ? '<span class="badge badge--collected artwork-thumb__collected-badge">Collected</span>' : ''}
        </div>
        <div class="artwork-thumb__body">
          <p class="artwork-thumb__title">${work.title}</p>
          <p class="artwork-thumb__meta">${work.medium} · ${work.dimensions}</p>
        </div>
      </a>
    </div>
  `;
}

function showNotFound() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="artist-not-found">
      <h1>Artist Not Found</h1>
      <p>We couldn't find the artist you're looking for.</p>
      <a href="artists.html" class="btn btn--primary">Browse All Artists</a>
    </section>
  `;
}
