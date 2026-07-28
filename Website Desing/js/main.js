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

    // Typewriter rotation for audience segments.
    // data-typewriter names the translations key of the segment list;
    // data-typewriter-items is a JSON fallback used before translations
    // load (or when the key is missing).
    var typewriterEls = document.querySelectorAll('[data-typewriter]');
    if (typewriterEls.length) {
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var initTypewriter = function(el) {
            var focusesKey = el.getAttribute('data-typewriter');
            var fallbackFocuses = [];
            try { fallbackFocuses = JSON.parse(el.getAttribute('data-typewriter-items') || '[]'); } catch (e) {}
            if (!fallbackFocuses.length) fallbackFocuses = [el.textContent];
            var index = 0;
            var timer = null;

            function getFocuses() {
                if (window.i18n && window.i18n.translations) {
                    var list = window.i18n.t(focusesKey);
                    if (Array.isArray(list) && list.length) return list;
                }
                return fallbackFocuses;
            }

            function schedule(fn, delay) { timer = setTimeout(fn, delay); }

            function typeText(text, pos) {
                el.textContent = text.slice(0, pos);
                if (pos < text.length) {
                    schedule(function() { typeText(text, pos + 1); }, 45 + Math.random() * 40);
                } else {
                    schedule(erase, 2400);
                }
            }

            function erase() {
                var current = el.textContent;
                if (current.length > 0) {
                    el.textContent = current.slice(0, -1);
                    schedule(erase, 28);
                } else {
                    var list = getFocuses();
                    index = (index + 1) % list.length;
                    schedule(function() { typeText(list[index], 0); }, 300);
                }
            }

            // (Re)start the cycle; also called on language switch so the
            // segment resets to the first focus in the new language
            function start() {
                clearTimeout(timer);
                var list = getFocuses();
                index = 0;
                el.textContent = list[0];
                if (reduceMotion) {
                    schedule(function tick() {
                        var l = getFocuses();
                        index = (index + 1) % l.length;
                        el.textContent = l[index];
                        schedule(tick, 3200);
                    }, 3200);
                } else {
                    schedule(erase, 2600);
                }
            }

            start();
            document.addEventListener('i18n:applied', start);
        };

        typewriterEls.forEach(function(el) { initTypewriter(el); });
    }
})();
