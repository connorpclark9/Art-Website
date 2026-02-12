/* ============================================
   KINDRED SEAL — FAQ Accordion & Tabs
   ============================================ */

class FAQManager {
  constructor(container) {
    this.container = container;
    if (!this.container) return;

    this.tabs = container.querySelectorAll('.faq__tab');
    this.panels = container.querySelectorAll('.faq__panel');
    this.init();
  }

  init() {
    // Tab switching
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        this.switchTab(target);
      });

      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const tabsArr = Array.from(this.tabs);
          const currentIdx = tabsArr.indexOf(tab);
          let nextIdx;
          if (e.key === 'ArrowRight') {
            nextIdx = (currentIdx + 1) % tabsArr.length;
          } else {
            nextIdx = (currentIdx - 1 + tabsArr.length) % tabsArr.length;
          }
          tabsArr[nextIdx].click();
          tabsArr[nextIdx].focus();
        }
      });
    });

    // Accordion items
    this.container.querySelectorAll('.faq__question').forEach(question => {
      question.addEventListener('click', () => {
        this.toggleAccordion(question);
      });

      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleAccordion(question);
        }
      });
    });
  }

  switchTab(target) {
    this.tabs.forEach(tab => {
      const isActive = tab.getAttribute('data-tab') === target;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });

    this.panels.forEach(panel => {
      const isActive = panel.getAttribute('data-panel') === target;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    });
  }

  toggleAccordion(question) {
    const item = question.closest('.faq__item');
    const panel = item.querySelector('.faq__panel');
    const answer = item.querySelector('.faq__answer');
    const isOpen = item.classList.contains('is-open');

    // Close all others in the same panel
    const parentPanel = question.closest('[data-panel]');
    if (parentPanel) {
      parentPanel.querySelectorAll('.faq__item.is-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          const openAnswer = openItem.querySelector('.faq__answer');
          openAnswer.style.maxHeight = '0';
          openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Toggle current
    if (isOpen) {
      item.classList.remove('is-open');
      answer.style.maxHeight = '0';
      question.setAttribute('aria-expanded', 'false');
    } else {
      item.classList.add('is-open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      question.setAttribute('aria-expanded', 'true');
    }
  }
}
