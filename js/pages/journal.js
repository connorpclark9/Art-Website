/* ============================================
   KINDRED SEAL — Journal Index Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('journal-grid');
  KindredSeal.showSkeleton(grid, 'journal-card', 4);

  const journal = await KindredSeal.fetchJSON('data/journal.json');
  if (!journal) return;

  // Sort by date, newest first
  const sorted = [...journal].sort((a, b) => new Date(b.date) - new Date(a.date));

  const html = sorted.map((post, i) => `
    <div class="journal-card animate-on-scroll animate-delay-${(i % 2) + 1}">
      <a href="post.html?id=${post.id}" class="journal-card__link">
        <div class="journal-card__image-wrapper">
          <img src="${post.featuredImage}" alt="${post.title}" class="journal-card__image" loading="lazy">
        </div>
        <div class="journal-card__body">
          <div class="journal-card__meta">
            <span class="badge">${post.category}</span>
            <span class="journal-card__date">${KindredSeal.formatDate(post.date)}</span>
          </div>
          <h2 class="journal-card__title">${post.title}</h2>
          <p class="journal-card__excerpt">${post.excerpt}</p>
        </div>
      </a>
    </div>
  `).join('');

  KindredSeal.hideSkeleton(grid, html);
});
