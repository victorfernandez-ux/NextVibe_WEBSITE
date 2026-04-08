(function() {
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var data = new FormData(form);
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data).toString()
            })
            .then(function() {
                form.style.display = 'none';
                document.getElementById('formSuccess').classList.add('show');
            })
            .catch(function() { alert('Something went wrong. Please try again.'); });
        });
    }
})();
