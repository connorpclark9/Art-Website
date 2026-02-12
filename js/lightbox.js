/* ============================================
   KINDRED SEAL — Lightbox Image Viewer
   Full-screen overlay gallery with navigation,
   keyboard support, swipe on mobile
   ============================================ */

class Lightbox {
  constructor() {
    this.images = [];
    this.currentIndex = 0;
    this.overlay = null;
    this.isOpen = false;

    this.build();
    this.bindGlobalEvents();
  }

  build() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('aria-label', 'Image viewer');
    this.overlay.innerHTML = `
      <div class="lightbox__backdrop"></div>
      <button class="lightbox__close" aria-label="Close image viewer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <button class="lightbox__prev" aria-label="Previous image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button class="lightbox__next" aria-label="Next image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      <div class="lightbox__content">
        <img class="lightbox__image" src="" alt="" />
      </div>
      <div class="lightbox__counter"></div>
    `;
    document.body.appendChild(this.overlay);

    // Bind internal events
    this.overlay.querySelector('.lightbox__backdrop').addEventListener('click', () => this.close());
    this.overlay.querySelector('.lightbox__close').addEventListener('click', () => this.close());
    this.overlay.querySelector('.lightbox__prev').addEventListener('click', () => this.prev());
    this.overlay.querySelector('.lightbox__next').addEventListener('click', () => this.next());

    // Touch support
    this.touchStartX = 0;
    const content = this.overlay.querySelector('.lightbox__content');
    content.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    content.addEventListener('touchend', (e) => {
      const diff = this.touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  }

  bindGlobalEvents() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  open(images, startIndex = 0) {
    this.images = images;
    this.currentIndex = startIndex;
    this.isOpen = true;

    this.overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    this.updateImage();
    this.updateNav();

    // Focus trap
    this.overlay.querySelector('.lightbox__close').focus();
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  next() {
    if (this.images.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  }

  prev() {
    if (this.images.length <= 1) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  }

  updateImage() {
    const img = this.overlay.querySelector('.lightbox__image');
    const src = this.images[this.currentIndex];
    img.style.opacity = '0';
    img.onload = () => {
      img.style.transition = 'opacity 0.3s ease';
      img.style.opacity = '1';
    };
    img.src = src;
    img.alt = `Image ${this.currentIndex + 1} of ${this.images.length}`;

    const counter = this.overlay.querySelector('.lightbox__counter');
    counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
  }

  updateNav() {
    const prevBtn = this.overlay.querySelector('.lightbox__prev');
    const nextBtn = this.overlay.querySelector('.lightbox__next');
    const single = this.images.length <= 1;
    prevBtn.style.display = single ? 'none' : '';
    nextBtn.style.display = single ? 'none' : '';

    const counter = this.overlay.querySelector('.lightbox__counter');
    counter.style.display = single ? 'none' : '';
  }
}

// Lightbox CSS injected dynamically
(function injectLightboxStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .lightbox {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .lightbox.is-open {
      opacity: 1;
      visibility: visible;
    }

    .lightbox__backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(20, 18, 16, 0.92);
    }

    .lightbox__content {
      position: relative;
      z-index: 1;
      max-width: 90vw;
      max-height: 85vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lightbox__image {
      max-width: 100%;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 4px;
      user-select: none;
    }

    .lightbox__close {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 2;
      background: none;
      border: none;
      color: #FFFDF9;
      cursor: pointer;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s ease;
    }

    .lightbox__close:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .lightbox__prev,
    .lightbox__next {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
      background: none;
      border: none;
      color: #FFFDF9;
      cursor: pointer;
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s ease;
    }

    .lightbox__prev { left: 16px; }
    .lightbox__next { right: 16px; }

    .lightbox__prev:hover,
    .lightbox__next:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .lightbox__counter {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      color: rgba(255, 253, 249, 0.7);
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      letter-spacing: 0.05em;
    }

    @media (max-width: 768px) {
      .lightbox__prev { left: 8px; }
      .lightbox__next { right: 8px; }
      .lightbox__prev,
      .lightbox__next {
        width: 44px;
        height: 44px;
      }
    }
  `;
  document.head.appendChild(style);
})();
