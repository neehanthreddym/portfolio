document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis for buttery smooth scrolling
    const lenis = new Lenis({
        autoRaf: true,
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easeOutExpo
        smoothWheel: true,
        wheelMultiplier: 1,
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: 0 }); // Removed offset so full-screen sections center naturally
            }
        });
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    card.style.animation = 'none';
                    // Trigger reflow for animation
                    card.offsetHeight;
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            const icon = mobileNavToggle.querySelector('i');
            if (navLinks.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking a link
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    const icon = mobileNavToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
    // ── Experience Section ──────────────────────────────────────────
    const expSection = document.querySelector('.experience');
    const expCards = document.querySelectorAll('.exp-card');
    const expNodes = document.querySelectorAll('.exp-date-node');
    const expTrackFill = document.getElementById('expTrackFill');
    const expExpandBtns = document.querySelectorAll('.exp-expand-btn');

    // 1. Card entrance animation via IntersectionObserver
    if (expCards.length) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const idx = parseInt(entry.target.getAttribute('data-index'), 10);
                if (entry.isIntersecting) {
                    // Stagger by card index
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, idx * 120);
                    // Activate corresponding date node
                    expNodes.forEach(n => n.classList.remove('active'));
                    if (expNodes[idx]) expNodes[idx].classList.add('active');
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        expCards.forEach(card => cardObserver.observe(card));
    }

    // 2. Active node tracking on scroll (after cards are visible)
    const nodeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = parseInt(entry.target.getAttribute('data-index'), 10);
                expNodes.forEach(n => n.classList.remove('active'));
                if (expNodes[idx]) expNodes[idx].classList.add('active');
            }
        });
    }, { threshold: 0.4, rootMargin: '-10% 0px -40% 0px' });

    expCards.forEach(card => nodeObserver.observe(card));

    // 3. Scroll-driven timeline line fill
    if (expSection && expTrackFill) {
        const updateFill = () => {
            const rect = expSection.getBoundingClientRect();
            const viewH = window.innerHeight;
            // progress: 0 when section top hits viewport bottom, 1 when section bottom hits viewport top
            const progress = Math.min(1, Math.max(0,
                (viewH - rect.top) / (rect.height + viewH)
            ));
            expTrackFill.style.height = (progress * 100) + '%';
        };
        window.addEventListener('scroll', updateFill, { passive: true });
        updateFill(); // run once on load
    }

    // 4. Expand / Collapse bullets
    expExpandBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.exp-card');
            const extra = card.querySelector('.exp-bullets-extra');
            const isExp = btn.getAttribute('aria-expanded') === 'true';

            if (isExp) {
                extra.classList.remove('expanded');
                extra.setAttribute('aria-hidden', 'true');
                btn.setAttribute('aria-expanded', 'false');
                btn.innerHTML = '<span class="exp-expand-icon">+</span> Expand Details';
            } else {
                extra.classList.add('expanded');
                extra.setAttribute('aria-hidden', 'false');
                btn.setAttribute('aria-expanded', 'true');
                btn.innerHTML = '<span class="exp-expand-icon">+</span> Collapse Details';
            }
        });
    });
});
