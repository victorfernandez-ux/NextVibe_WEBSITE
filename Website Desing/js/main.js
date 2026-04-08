(function() {
    // Scroll progress
    var progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            var scrollTop = document.documentElement.scrollTop;
            var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollHeight > 0) progressBar.style.width = (scrollTop / scrollHeight * 100) + '%';
        });
    }

    // Mobile menu
    var menuBtn = document.getElementById('menuBtn');
    var mainNav = document.getElementById('mainNav');
    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('open');
        });
    }

    // Cursor glow (desktop only)
    var glow = document.getElementById('cursorGlow');
    if (glow && window.innerWidth > 768) {
        glow.style.display = 'block';
        document.addEventListener('mousemove', function(e) {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // Intersection Observer for reveal animations
    var reveals = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    reveals.forEach(function(el) { observer.observe(el); });

    // Active nav link
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a[href]').forEach(function(link) {
        if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });
})();
