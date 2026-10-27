(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a');
  const video = document.querySelector('.video-card video');
  const videoCard = document.querySelector('.video-card');
  const playButtons = document.querySelectorAll('[data-play-video]');

  function closeMenu() {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    mainNav.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
      mainNav.classList.toggle('open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  function updateHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 16);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    revealItems.forEach(function (item, index) {
      const group = item.closest('.stagger-group');
      if (group) {
        const groupItems = Array.from(group.querySelectorAll('[data-reveal]'));
        item.style.setProperty('--reveal-delay', (groupItems.indexOf(item) * 70) + 'ms');
      } else if (index < 2) {
        item.style.setProperty('--reveal-delay', (index * 100) + 'ms');
      }
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  const pageSections = document.querySelectorAll('main section[id], #inicio');
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    pageSections.forEach(function (section) { sectionObserver.observe(section); });
  }

  if (playButtons.length && video) {
    playButtons.forEach(function (playButton) {
      playButton.addEventListener('click', function (event) {
        event.preventDefault();
        video.muted = false;
        video.volume = 1;
        video.play().catch(function () {});
        video.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

    video.addEventListener('play', function () {
      if (videoCard) videoCard.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (videoCard) videoCard.classList.remove('is-playing');
    });

    video.addEventListener('ended', function () {
      if (videoCard) videoCard.classList.remove('is-playing');
    });
  }

  const currentYear = document.getElementById('current-year');
  if (currentYear) currentYear.textContent = new Date().getFullYear();
})();
