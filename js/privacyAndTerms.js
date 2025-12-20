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

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('aside nav a[href^="#term"]');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(sec => {
    const offset = sec.offsetTop - 100;
    if (window.scrollY >= offset) {
      current = sec.id;
    }
  });

  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${current}`;

    link.classList.toggle('text-[var(--green)]', isActive);
    link.classList.toggle('text-white', !isActive);
  });
});

