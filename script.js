/**
 * Václav Supik – tesař–truhlář  |  script.js
 */

/* === EMAILJS CONFIG — vyplň po registrácii na emailjs.com === */
var EMAILJS_PUBLIC_KEY  = 'wVuRDgb7TmZodV226';
var EMAILJS_SERVICE_ID  = 'service_rotdon4';
var EMAILJS_TEMPLATE_ID = 'template_k4bkzke';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

(function () {
  'use strict';

  /* === COPYRIGHT YEAR === */
  var yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* === HAMBURGER MENU === */
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('main-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a nav link is clicked
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* === STICKY HEADER: add shadow class on scroll === */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 16px rgba(90,50,16,0.18)';
      } else {
        header.style.boxShadow = '0 2px 8px rgba(90,50,16,0.10)';
      }
    }, { passive: true });
  }

  /* === CONTACT FORM === */
  var form = document.getElementById('contact-form');
  var successMsg = document.getElementById('form-success');
  var submitBtn = form ? form.querySelector('[type="submit"]') : null;

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;

      // Clear previous errors
      form.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });

      // Validate required fields (name, message)
      var required = form.querySelectorAll('[required]');
      required.forEach(function (field) {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      // Validate: at least phone or email must be filled
      var phoneField = form.querySelector('#phone');
      var emailField = form.querySelector('#email');
      if (!phoneField.value.trim() && !emailField.value.trim()) {
        phoneField.classList.add('error');
        emailField.classList.add('error');
        valid = false;
      }

      if (!valid) {
        var firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      // Disable button during send
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Odesílám…';
      }

      var templateParams = {
        from_name:    form.querySelector('#name').value.trim(),
        from_phone:   form.querySelector('#phone').value.trim(),
        from_email:   form.querySelector('#email').value.trim(),
        reply_to:     form.querySelector('#email').value.trim() || '',
        service:      form.querySelector('#service').value,
        message:      form.querySelector('#message').value.trim(),
        to_email:     'tomas.majerciak@gmail.com'
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function () {
          if (successMsg) successMsg.hidden = false;
          form.reset();
          setTimeout(function () {
            if (successMsg) successMsg.hidden = true;
          }, 6000);
        })
        .catch(function (err) {
          alert('Odeslání se nezdařilo. Zkuste to prosím znovu nebo zavolejte.');
          console.error('EmailJS error:', err);
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Odeslat poptávku';
          }
        });
    });
  }

})();
