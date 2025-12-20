(function () {
  const wrap = document.getElementById('menu-wrap');
  const openBtn = document.getElementById('open-menu');
  const closeBtn = document.getElementById('close-menu');
  const backdrop = document.getElementById('close-backdrop');
  const aside = document.getElementById('mobile-menu');

  if (!wrap || !openBtn || !aside) return;

  const show = () => {
    wrap.classList.remove('pointer-events-none', 'opacity-0');
    aside.classList.remove('-translate-x-full');
  };

  const hide = () => {
    wrap.classList.add('pointer-events-none', 'opacity-0');
    aside.classList.add('-translate-x-full');
  };

  openBtn.addEventListener('click', show);
  closeBtn?.addEventListener('click', hide);
  backdrop?.addEventListener('click', hide);

  aside.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', hide);
  });
})();

// FAQ dropdown
(function () {
  const items = document.querySelectorAll('[data-faq-item]');
  if (!items.length) return;

  function closeBody(item, body, icon) {
    body.style.maxHeight = '0px';
    body.style.paddingTop = '0px';
    if (icon) icon.textContent = '+';

    item.classList.remove('py-6');
    item.classList.add('py-8');
  }

  function openBody(item, body, icon) {
    body.style.maxHeight = body.scrollHeight + 'px';
    if (icon) icon.textContent = '-';

    item.classList.remove('py-8');
    item.classList.add('py-6');
  }

  items.forEach((item) => {
    const body = item.querySelector('[data-faq-body]');
    const icon = item.querySelector('[data-faq-icon]');
    const toggleBtn = item.querySelector('[data-faq-toggle]');
    if (!body || !toggleBtn) return;

    body.style.overflow = 'hidden';
    body.style.transition = 'max-height 0.25s ease, padding-top 0.25s ease';

    if (item.hasAttribute('data-open')) {
      item.classList.add('is-open');
      openBody(item, body, icon);
    } else {
      closeBody(item, body, icon);
    }

    toggleBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      items.forEach((other) => {
        if (other === item) return;
        const b = other.querySelector('[data-faq-body]');
        const i = other.querySelector('[data-faq-icon]');
        if (!b) return;
        other.classList.remove('is-open');
        closeBody(other, b, i);
      });

      if (isOpen) {
        item.classList.remove('is-open');
        closeBody(item, body, icon);
      } else {
        item.classList.add('is-open');
        openBody(item, body, icon);
      }
    });
  });
})();

// MODAL
(function () {
  const openBtn = document.getElementById('open-contact-modal');
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('close-contact-modal');

  if (!openBtn || !modal || !closeBtn) return;

  const openModal = () => {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
  };

  const closeModal = () => {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100');
    document
      .querySelectorAll('[data-custom-select].is-open')
      .forEach((el) => toggleSelect(el, false));
  };

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function toggleSelect(wrapper, show) {
    const dropdown = wrapper.querySelector('[data-select-dropdown]');
    const arrow = wrapper.querySelector('[data-select-arrow]');
    if (!dropdown || !arrow) return;

    if (show) {
      wrapper.classList.add('is-open');
      dropdown.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
      dropdown.classList.add('opacity-100', 'scale-100');
      arrow.textContent = '▴';
    } else {
      wrapper.classList.remove('is-open');
      dropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
      dropdown.classList.remove('opacity-100', 'scale-100');
      arrow.textContent = '▾';
    }
  }

  const selects = document.querySelectorAll('[data-custom-select]');

  selects.forEach((wrapper) => {
    const trigger = wrapper.querySelector('[data-select-trigger]');
    const label = wrapper.querySelector('[data-select-label]');
    const hidden = wrapper.querySelector('[data-select-hidden]');
    const options = wrapper.querySelectorAll('[data-select-option]');

    if (!trigger || !label || !hidden || !options.length) return;

    label.textContent = 'Select';
    hidden.value = '';

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('is-open');
      selects.forEach((w) => w !== wrapper && toggleSelect(w, false));
      toggleSelect(wrapper, !isOpen);
    });

    options.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = opt.getAttribute('data-select-option') || '';
        label.textContent = opt.textContent.trim();
        hidden.value = value;
        toggleSelect(wrapper, false);
      });
    });
  });

  document.addEventListener('click', (e) => {
    selects.forEach((wrapper) => {
      if (!wrapper.contains(e.target)) {
        toggleSelect(wrapper, false);
      }
    });
  });
})();

// Mobile slider for "get" cards
(function () {
  const root = document.querySelector('[data-features-slider]');
  if (!root) return;

  const viewport = root.querySelector('[data-slider-viewport]');
  const track = root.querySelector('[data-slider-track]');
  const slides = Array.from(root.querySelectorAll('[data-slide]'));
  const dotsWrap = root.querySelector('[data-slider-dots]');
  if (!viewport || !track || !slides.length || !dotsWrap) return;

  let current = 0;
  let isMobile = window.innerWidth < 768;
  let slideWidth = 0;

  dotsWrap.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.dataset.index = i;
    dot.className =
      'h-[4px] w-9 rounded-full transition-colors duration-200 ' +
      (i === 0 ? 'bg-[var(--green)]' : 'bg-[#D2D2D2]');
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('button'));

  function setDots() {
    dots.forEach((dot, i) => {
      dot.className =
        'h-[4px] w-9 rounded-full transition-colors duration-200 ' +
        (i === current ? 'bg-[var(--green)]' : 'bg-[#D2D2D2]');
    });
  }

  function updateLayout() {
    isMobile = window.innerWidth < 768;

    if (!isMobile) {
      track.style.transform = 'translateX(0)';
      slides.forEach((s) => {
        s.style.width = '';
      });
      dotsWrap.classList.add('hidden');
      return;
    }

    dotsWrap.classList.remove('hidden');

    slideWidth = viewport.clientWidth;
    slides.forEach((s) => {
      s.style.width = slideWidth + 'px';
    });

    goTo(current, false);
  }

  function goTo(index, animate = true) {
    if (!isMobile) return;

    current = Math.max(0, Math.min(index, slides.length - 1));
    if (!slideWidth) slideWidth = viewport.clientWidth;

    if (!animate) {
      track.style.transition = 'none';
      track.style.transform = `translateX(-${current * slideWidth}px)`;
      void track.offsetWidth;
      track.style.transition = 'transform 0.3s ease-out';
    } else {
      track.style.transform = `translateX(-${current * slideWidth}px)`;
    }

    setDots();
  }

  dotsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-index]');
    if (!btn) return;
    goTo(parseInt(btn.dataset.index, 10));
  });

  window.addEventListener('resize', updateLayout);

  updateLayout();
})();

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});
