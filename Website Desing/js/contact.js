(function() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(msg) {
        var el = document.getElementById('formError');
        if (!el) return;
        el.textContent = msg;
        el.style.display = 'block';
    }

    function clearError() {
        var el = document.getElementById('formError');
        if (el) el.style.display = 'none';
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearError();

        var name = form.querySelector('[name="name"]');
        var email = form.querySelector('[name="email"]');

        if (name && !name.value.trim()) {
            showError('Please enter your name.');
            name.focus();
            return;
        }
        if (email && !emailRe.test(email.value.trim())) {
            showError('Please enter a valid email address.');
            email.focus();
            return;
        }

        var submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(form)).toString()
        })
        .then(function() {
            form.style.display = 'none';
            var success = document.getElementById('formSuccess');
            if (success) success.classList.add('show');
        })
        .catch(function() {
            showError('Something went wrong. Please try again or email hello@nextvibeai.com directly.');
            if (submitBtn) submitBtn.disabled = false;
        });
    });
})();
