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
    // Hero subtitle: rotate the customer-focus segment
    (function() {
        var el = document.getElementById('heroFocus');
        if (!el) return;
        var fallbackFocuses = ['UK recruitment firms', 'marketing agencies', 'coaches & consultants', 'e-commerce brands'];
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var index = 0;

        function getFocuses() {
            if (window.i18n && window.i18n.translations) {
                var list = window.i18n.t('hero.focuses');
                if (Array.isArray(list) && list.length) return list;
            }
            return fallbackFocuses;
        }

        setInterval(function() {
            var list = getFocuses();
            index = (index + 1) % list.length;
            if (reduceMotion) {
                el.textContent = list[index];
                return;
            }
            el.classList.add('is-swapping');
            setTimeout(function() {
                el.textContent = list[index];
                el.classList.remove('is-swapping');
            }, 250);
        }, 3200);

        // On language switch, restart from the first focus in the new language
        document.addEventListener('i18n:applied', function() {
            index = 0;
            el.textContent = getFocuses()[0];
        });
    })();

    document.getElementById('employees').addEventListener('input', updateCalculator);
    document.getElementById('hourlyRate').addEventListener('input', updateCalculator);
    document.getElementById('hoursWasted').addEventListener('input', updateCalculator);
    updateCalculator();
    // Re-run after full page load so i18n async re-renders don't leave stale £0
    window.addEventListener('load', updateCalculator);
})();
