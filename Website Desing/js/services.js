(function() {
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'));
        var suffix = el.textContent.replace(/[0-9]/g, '');
        var duration = 2000;
        var start = null;
        function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            el.textContent = Math.floor(easeOutQuart(progress) * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    var counters = document.querySelectorAll('[data-count]');
    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
        });
    }, { threshold: 0.5 });
    counters.forEach(function(el) { counterObserver.observe(el); });
})();
