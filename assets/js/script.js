// Carousel Functionality
window.scrollToSlide = function(containerId, slideIndex) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const slideWidth = container.clientWidth;
    container.scrollTo({
        left: slideWidth * slideIndex,
        behavior: 'smooth'
    });
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const hamburger = document.querySelector('.hamburger');

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // Simple hamburger animation class toggle (optional styling could be added in CSS)
        // For now, it just toggles the menu display.
        if(mobileMenu.classList.contains('active')) {
            hamburger.style.backgroundColor = 'transparent';
            hamburger.style.setProperty('--before-top', '0');
            hamburger.style.setProperty('--after-top', '0');
        } else {
            hamburger.style.backgroundColor = 'var(--clr-text-main)';
        }
    });

    // Close mobile menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.style.backgroundColor = 'var(--clr-text-main)';
        });
    });

    // 2. Sticky Navbar & Shrink on Scroll (Throttled for performance)
    const navbar = document.querySelector('.navbar');
    let scrollTicking = false;
    
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.style.padding = '1rem 0';
                    navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
                } else {
                    navbar.style.padding = '1.5rem 0';
                    navbar.style.boxShadow = 'none';
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // If it's just "#", skip
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                // Offset for fixed navbar
                const offset = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Carousel Dots Sync on Scroll
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(container => {
        container.addEventListener('scroll', () => {
            const index = Math.round(container.scrollLeft / container.clientWidth);
            const nav = container.nextElementSibling;
            if (nav && nav.classList.contains('carousel-nav')) {
                const dots = nav.querySelectorAll('.carousel-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        });
    });
    // 5. Scroll Animations (Reveal Up)
    const revealElements = document.querySelectorAll('.collection-item, .section-header, .about-card');
    revealElements.forEach(el => el.classList.add('reveal-up')); // Add class dynamically so it is accessible without JS

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 6. Catalog Tab Filter
    const tabBtns = document.querySelectorAll('.tab-btn');
    const collectionItems = document.querySelectorAll('.collection-item');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            collectionItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden-item');
                    // Retrigger reveal animation
                    item.classList.remove('active');
                    setTimeout(() => {
                        item.classList.add('active');
                    }, 50);
                } else {
                    item.classList.add('hidden-item');
                }
            });
            
            // Adjust alternating reversed class for valid spacing
            let visibleIndex = 0;
            collectionItems.forEach(item => {
                if (!item.classList.contains('hidden-item')) {
                    if (visibleIndex % 2 !== 0) {
                        item.classList.add('reversed');
                    } else {
                        item.classList.remove('reversed');
                    }
                    visibleIndex++;
                }
            });
        });
    });


});
