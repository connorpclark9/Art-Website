/* ============================================
   KINDRED SEAL — Individual Journal Post Logic
   Renders Markdown body using marked.js
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const postId = KindredSeal.getQueryParam('id');
  if (!postId) {
    showNotFound();
    return;
  }

  const journal = await KindredSeal.fetchJSON('data/journal.json');
  if (!journal) return;

  const post = journal.find(p => p.id === postId);
  if (!post) {
    showNotFound();
    return;
  }

  // --- Update Page Meta ---
  document.title = `${post.title} | Kindred Seal Journal`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', post.excerpt);

  // --- Render Hero ---
  const heroEl = document.getElementById('post-hero');
  heroEl.innerHTML = `
    <img src="${post.featuredImage}" alt="${post.title}" class="post-hero__image">
    <div class="post-hero__overlay"></div>
  `;

  // --- Render Header ---
  const headerEl = document.getElementById('post-header');
  headerEl.innerHTML = `
    <div class="post-header__meta">
      <span class="badge">${post.category}</span>
      <span class="journal-card__date">${KindredSeal.formatDate(post.date)}</span>
    </div>
    <h1 class="post-header__title">${post.title}</h1>
    <p class="post-header__byline">By ${post.author}</p>
  `;

  // --- Render Body (Markdown) ---
  const contentEl = document.getElementById('post-content');

  // Use marked.js if available, otherwise simple fallback
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
    contentEl.innerHTML = `<div class="prose">${marked.parse(post.body)}</div>`;
  } else {
    // Simple Markdown fallback
    contentEl.innerHTML = `<div class="prose">${simpleMarkdown(post.body)}</div>`;
  }

  // --- Related Posts ---
  const relatedEl = document.getElementById('related-posts');
  const otherPosts = journal.filter(p => p.id !== postId).slice(0, 3);

  if (otherPosts.length > 0) {
    relatedEl.innerHTML = `
      <div class="container">
        <div class="section-header animate-on-scroll">
          <span class="section-header__label">Keep Reading</span>
          <h2 class="section-header__title">More From the Journal</h2>
        </div>
        <div class="related-posts__grid">
          ${otherPosts.map((p, i) => `
            <div class="journal-card animate-on-scroll animate-delay-${i + 1}">
              <a href="post.html?id=${p.id}" class="journal-card__link">
                <div class="journal-card__image-wrapper">
                  <img src="${p.featuredImage}" alt="${p.title}" class="journal-card__image" loading="lazy">
                </div>
                <div class="journal-card__body">
                  <div class="journal-card__meta">
                    <span class="badge">${p.category}</span>
                    <span class="journal-card__date">${KindredSeal.formatDate(p.date)}</span>
                  </div>
                  <h2 class="journal-card__title">${p.title}</h2>
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

// Simple Markdown parser fallback (used if marked.js fails to load)
function simpleMarkdown(md) {
  let html = md;

  // Headings
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');

  // Bold & italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Paragraphs (lines separated by double newline)
  html = html.split('\n\n').map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<h') || block.startsWith('<blockquote') || block.startsWith('<img') || block.startsWith('<ul') || block.startsWith('<ol')) {
      return block;
    }
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  return html;
}

function showNotFound() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="post-not-found">
      <h1>Post Not Found</h1>
      <p>We couldn't find the journal post you're looking for.</p>
      <a href="journal.html" class="btn btn--primary">Browse the Journal</a>
    </section>
  `;
}
