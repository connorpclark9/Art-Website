/* ============================================
   KINDRED SEAL — Main JavaScript
   Shared utilities, navigation, skeleton loading,
   scroll animations
   ============================================ */

const KindredSeal = {
  // --- Data Fetching ---
  async fetchJSON(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
      return null;
    }
  },

  // --- URL Helpers ---
  getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  },

  // --- Navigation ---
  initNav() {
    const hamburger = document.querySelector('.nav__hamburger');
    const panel = document.querySelector('.nav__mobile-panel');
    const overlay = document.querySelector('.nav__overlay');
    const mobileLinks = document.querySelectorAll('.nav__mobile-link');

    if (!hamburger || !panel || !overlay) return;

    const openMenu = () => {
      hamburger.classList.add('is-active');
      hamburger.setAttribute('aria-expanded', 'true');
      panel.classList.add('is-open');
      overlay.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
      // Focus trap: focus first link
      const firstLink = panel.querySelector('.nav__mobile-link');
      if (firstLink) firstLink.focus();
    };

    const closeMenu = () => {
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      document.body.style.overflow = '';
      hamburger.focus();
    };

    hamburger.addEventListener('click', () => {
      const isOpen = panel.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Focus trap within mobile panel
    panel.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = panel.querySelectorAll('a, button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Set active nav link
    this.setActiveNavLink();
  },

  setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link, .nav__mobile-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('/').pop().split('?')[0];
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  },

  // --- Scroll Animations ---
  initScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  },

  // --- Skeleton Loading ---
  showSkeleton(container, type, count = 1) {
    if (!container) return;
    let html = '';

    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'artist-card':
          html += `
            <div class="skeleton--card">
              <div class="skeleton skeleton--image"></div>
              <div style="padding: 1.5rem;">
                <div class="skeleton skeleton--title"></div>
                <div class="skeleton skeleton--text skeleton--text-short"></div>
                <div class="skeleton skeleton--text"></div>
              </div>
            </div>`;
          break;

        case 'artwork-card':
          html += `
            <div class="skeleton--card">
              <div class="skeleton skeleton--image" style="aspect-ratio: 1;"></div>
              <div style="padding: 1rem;">
                <div class="skeleton skeleton--title" style="height: 20px;"></div>
                <div class="skeleton skeleton--text skeleton--text-short" style="height: 14px;"></div>
              </div>
            </div>`;
          break;

        case 'journal-card':
          html += `
            <div class="skeleton--card">
              <div class="skeleton skeleton--image" style="aspect-ratio: 16/9;"></div>
              <div style="padding: 1.5rem;">
                <div class="skeleton skeleton--text skeleton--text-short" style="height: 12px;"></div>
                <div class="skeleton skeleton--title"></div>
                <div class="skeleton skeleton--text"></div>
                <div class="skeleton skeleton--text skeleton--text-short"></div>
              </div>
            </div>`;
          break;

        case 'hero':
          html += `
            <div class="skeleton" style="width: 100%; aspect-ratio: 21/9; border-radius: var(--radius-md);"></div>`;
          break;

        case 'text-block':
          html += `
            <div>
              <div class="skeleton skeleton--title"></div>
              <div class="skeleton skeleton--text"></div>
              <div class="skeleton skeleton--text"></div>
              <div class="skeleton skeleton--text skeleton--text-short"></div>
            </div>`;
          break;

        default:
          html += `<div class="skeleton skeleton--text"></div>`;
      }
    }

    container.innerHTML = html;
  },

  hideSkeleton(container, content) {
    if (!container) return;
    container.style.opacity = '0';
    setTimeout(() => {
      container.innerHTML = content;
      container.style.transition = 'opacity 0.4s ease';
      container.style.opacity = '1';
      // Re-init scroll animations for new content
      this.initScrollAnimations();
    }, 50);
  },

  // --- Utility: Truncate Text ---
  truncate(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  // --- Utility: Format Date ---
  formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // --- Generate mailto link with subject ---
  getInquiryEmail(subject) {
    const email = 'connorpclark9@gmail.com';
    return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  },

  // --- Initialize ---
  init() {
    this.initNav();
    this.initScrollAnimations();
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  KindredSeal.init();
});
