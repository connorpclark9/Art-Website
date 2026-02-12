/* ============================================
   KINDRED SEAL — Artwork Detail Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const artworkId = KindredSeal.getQueryParam('id');
  if (!artworkId) {
    showNotFound();
    return;
  }

  const artworks = await KindredSeal.fetchJSON('data/artworks.json');
  if (!artworks) return;

  const artwork = artworks.find(a => a.id === artworkId);
  if (!artwork) {
    showNotFound();
    return;
  }

  // --- Update Page Meta ---
  document.title = `${artwork.title} by ${artwork.artistName} | Kindred Seal`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', KindredSeal.truncate(artwork.story, 160));

  // --- Initialize Lightbox ---
  const lightbox = new Lightbox();

  // --- Render Images ---
  const imagesEl = document.getElementById('artwork-images');
  const mainImg = artwork.images[0] || artwork.mainImage;

  imagesEl.innerHTML = `
    <img src="${mainImg}" alt="${artwork.title}" class="artwork-detail__main-image" id="main-artwork-image">
    ${artwork.images.length > 1 ? `
      <div class="artwork-detail__thumbs">
        ${artwork.images.map((img, i) => `
          <img src="${img}" alt="${artwork.title} view ${i + 1}" class="artwork-detail__thumb ${i === 0 ? 'is-active' : ''}" data-index="${i}">
        `).join('')}
      </div>
    ` : ''}
  `;

  // Main image click → lightbox
  const mainImage = document.getElementById('main-artwork-image');
  mainImage.addEventListener('click', () => {
    lightbox.open(artwork.images, getCurrentImageIndex());
  });

  // Thumbnail clicks
  imagesEl.querySelectorAll('.artwork-detail__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const index = parseInt(thumb.dataset.index);
      mainImage.src = artwork.images[index];
      imagesEl.querySelectorAll('.artwork-detail__thumb').forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });
  });

  function getCurrentImageIndex() {
    const activeThumb = imagesEl.querySelector('.artwork-detail__thumb.is-active');
    return activeThumb ? parseInt(activeThumb.dataset.index) : 0;
  }

  // --- Render Info ---
  const infoEl = document.getElementById('artwork-info');
  const subject = `Inquiry: ${artwork.title} by ${artwork.artistName}`;

  infoEl.innerHTML = `
    <a href="artist.html?id=${artwork.artistId}" class="artwork-detail__artist-link">${artwork.artistName}</a>
    <h1 class="artwork-detail__title">${artwork.title}</h1>
    <div class="artwork-detail__meta">
      <span>${artwork.medium}</span>
      <span>${artwork.dimensions}</span>
      <span>${artwork.year}</span>
    </div>

    <div class="artwork-detail__divider"></div>

    <div class="artwork-detail__story">
      <span class="artwork-detail__story-label">The Story Behind This Piece</span>
      <div class="prose">
        ${artwork.story.split('\n\n').map(p => `<p>${p}</p>`).join('')}
      </div>
    </div>

    <div class="artwork-detail__inquiry">
      <p class="artwork-detail__inquiry-label">Pricing</p>
      <p class="artwork-detail__inquiry-price">Inquire for Pricing</p>
      <p class="artwork-detail__inquiry-text">
        Interested in this piece? We'd love to help.
      </p>
      <a href="${KindredSeal.getInquiryEmail(subject)}" class="btn btn--primary" style="width: 100%; text-align: center;">
        Email Us About This Piece
      </a>
    </div>
  `;

  // --- More From This Artist ---
  const moreEl = document.getElementById('more-from-artist');
  const otherWorks = artworks.filter(
    a => a.artistId === artwork.artistId && a.id !== artwork.id && a.status === 'available'
  ).slice(0, 3);

  if (otherWorks.length > 0) {
    moreEl.innerHTML = `
      <div class="container">
        <div class="section-header animate-on-scroll">
          <span class="section-header__label">More from ${artwork.artistName}</span>
          <h2 class="section-header__title">Other Available Works</h2>
        </div>
        <div class="more-from-artist__grid">
          ${otherWorks.map((work, i) => `
            <div class="artwork-thumb animate-on-scroll animate-delay-${i + 1}">
              <a href="artwork.html?id=${work.id}" class="artwork-thumb__link">
                <div class="artwork-thumb__image-wrapper" style="aspect-ratio: 1;">
                  <img src="${work.mainImage}" alt="${work.title}" class="artwork-thumb__image" loading="lazy">
                </div>
                <div class="artwork-thumb__body">
                  <p class="artwork-thumb__title">${work.title}</p>
                  <p class="artwork-thumb__meta">${work.medium}</p>
                </div>
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  KindredSeal.initScrollAnimations();
});

function showNotFound() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="artwork-not-found">
      <h1>Artwork Not Found</h1>
      <p>We couldn't find the artwork you're looking for.</p>
      <a href="artists.html" class="btn btn--primary">Browse Artists</a>
    </section>
  `;
}
