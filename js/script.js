//  Handles smooth scrolling, reveal animations, project filtering, and mobile navigation.

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LENIS SMOOTH SCROLLING ---
    const lenis = new Lenis({
        duration: 0.7,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: -70, // offset for fixed header
                    duration: 1.2
                });
                
                // Close mobile nav if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // --- 2. INTERSECTION OBSERVER (REVEAL ANIMATIONS) ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing after reveal for performance
                // observer.unobserve(entry.target); 
            }
        });
    };

    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before the element comes into view
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3. PROJECT FILTERING ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const systemCards = document.querySelectorAll('.system-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            systemCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'flex';
                    // Re-trigger reveal animation
                    card.classList.remove('active');
                    setTimeout(() => card.classList.add('active'), 50);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('active');
                }
            });
            
            // Re-calculate Lenis scroll height after filtering
            setTimeout(() => lenis.resize(), 100);
        });
    });

    // --- 4. MOBILE NAVIGATION TOGGLE ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- 5. HEADER SHRINK ON SCROLL ---
    const header = document.querySelector('.sys-header');
    let lastScrollY = window.scrollY;

    lenis.on('scroll', (e) => {
        const currentScrollY = window.scrollY;
        
        // Add minimal styling when scrolled
        if (currentScrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });

    // --- 6. INITIAL TRIGGER FOR HERO ELEMENTS ---
    // Ensure hero elements reveal immediately on load
    setTimeout(() => {
        const heroReveals = document.querySelectorAll('.sys-hero .reveal');
        heroReveals.forEach(el => el.classList.add('active'));
    }, 100);

});
