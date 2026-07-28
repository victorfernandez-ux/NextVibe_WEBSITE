(function() {
    // Counter animation with easeOutQuart
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'));
        var duration = 2000;
        var start = null;
        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var value = Math.floor(easeOutQuart(progress) * target);
            el.textContent = value + (target === 77 ? '%' : '+');
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    var counters = document.querySelectorAll('[data-count]');
    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(function(el) { counterObserver.observe(el); });

    // Savings calculator
    function updateCalculator() {
        var employees = parseInt(document.getElementById('employees').value) || 0;
        var rate = parseInt(document.getElementById('hourlyRate').value) || 0;
        var hours = parseInt(document.getElementById('hoursWasted').value) || 0;
        var automationRate = 0.65;
        var weeklySavings = employees * rate * hours * automationRate;
        var monthly = weeklySavings * 4.33;
        var annual = monthly * 12;
        var hoursYear = Math.round(employees * hours * automationRate * 52);
        document.getElementById('annualSavings').textContent = '£' + Math.round(annual).toLocaleString();
        document.getElementById('monthlySavings').textContent = '£' + Math.round(monthly).toLocaleString();
        document.getElementById('hoursReclaimed').textContent = hoursYear.toLocaleString();
    }
    // Hero subtitle: typewriter rotation of the customer-focus segment
    (function() {
        var el = document.getElementById('heroFocus');
        if (!el) return;
        var fallbackFocuses = ['UK recruitment firms', 'marketing agencies', 'coaches & consultants', 'e-commerce brands'];
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var index = 0;
        var timer = null;

        function getFocuses() {
            if (window.i18n && window.i18n.translations) {
                var list = window.i18n.t('hero.focuses');
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
    })();

    document.getElementById('employees').addEventListener('input', updateCalculator);
    document.getElementById('hourlyRate').addEventListener('input', updateCalculator);
    document.getElementById('hoursWasted').addEventListener('input', updateCalculator);
    updateCalculator();
    // Re-run after full page load so i18n async re-renders don't leave stale £0
    window.addEventListener('load', updateCalculator);
})();
