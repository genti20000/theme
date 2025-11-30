
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-toggle');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const backdrop = document.getElementById('mobile-menu-backdrop');

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', function() {
            menuOverlay.classList.toggle('hidden');
        });
        
        backdrop.addEventListener('click', function() {
            menuOverlay.classList.add('hidden');
        });
    }

    // Hero Parallax Effect
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const heroBg = document.querySelector('.hero-bg-img'); // Add this class to your hero img in PHP
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
        }
    });
});
