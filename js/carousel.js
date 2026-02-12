/* ============================================
   KINDRED SEAL — Hero Carousel
   Auto-rotating with manual controls,
   pause on hover, swipe support
   ============================================ */

class HeroCarousel {
  constructor(container) {
    this.container = container;
    if (!this.container) return;

    this.track = container.querySelector('.carousel__track');
    this.slides = [];
    this.dots = container.querySelector('.carousel__dots');
    this.prevBtn = container.querySelector('.carousel__prev');
    this.nextBtn = container.querySelector('.carousel__next');

    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.autoplayDelay = 5500;
    this.isHovered = false;
    this.isTransitioning = false;

    // Touch support
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    this.slides = this.track.querySelectorAll('.carousel__slide');
    if (this.slides.length === 0) return;

    this.buildDots();
    this.bindEvents();
    this.goTo(0, false);
    this.startAutoplay();
  }

  buildDots() {
    if (!this.dots) return;
    this.dots.innerHTML = '';
    this.slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      this.dots.appendChild(dot);
    });
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Pause on hover
    this.container.addEventListener('mouseenter', () => {
      this.isHovered = true;
      this.stopAutoplay();
    });

    this.container.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.startAutoplay();
    });

    // Touch / swipe
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.stopAutoplay();
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
      if (!this.isHovered) this.startAutoplay();
    }, { passive: true });

    // Keyboard
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoplay();
      } else if (!this.isHovered) {
        this.startAutoplay();
      }
    });

    // Reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.stopAutoplay();
    }
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    const threshold = 50;
    if (Math.abs(diff) < threshold) return;
    if (diff > 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  goTo(index, animate = true) {
    if (this.isTransitioning) return;

    const total = this.slides.length;
    this.currentIndex = ((index % total) + total) % total;

    if (animate) {
      this.isTransitioning = true;
      setTimeout(() => { this.isTransitioning = false; }, 600);
    }

    // Update slides
    this.slides.forEach((slide, i) => {
      slide.classList.remove('is-active', 'is-exiting');
      if (i === this.currentIndex) {
        slide.classList.add('is-active');
      }
    });

    // Update dots
    if (this.dots) {
      const dotEls = this.dots.querySelectorAll('.carousel__dot');
      dotEls.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === this.currentIndex);
      });
    }
  }

  next() {
    this.goTo(this.currentIndex + 1);
    this.restartAutoplay();
  }

  prev() {
    this.goTo(this.currentIndex - 1);
    this.restartAutoplay();
  }

  startAutoplay() {
    if (this.autoplayInterval) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.autoplayInterval = setInterval(() => {
      this.next();
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  restartAutoplay() {
    this.stopAutoplay();
    if (!this.isHovered) {
      this.startAutoplay();
    }
  }
}
