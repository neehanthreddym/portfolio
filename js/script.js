document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const revealItems = document.querySelectorAll('.reveal');

  const setHeaderState = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.innerHTML = isOpen ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -70px 0px' });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
    revealObserver.observe(item);
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      projectCards.forEach((card) => {
        const categories = card.dataset.category.split(' ');
        const shouldShow = filter === 'all' || categories.includes(filter);
        card.classList.toggle('hidden', !shouldShow);
      });
    });
  });
});