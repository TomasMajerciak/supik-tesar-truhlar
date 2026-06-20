/**
 * Stolařství Václav Supik  |  script.js
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

  /* --- Sanitization: escape < and > to prevent HTML injection --- */
  function sanitizeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  /* --- Show an error message under a field --- */
  function setFieldError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errEl = document.getElementById('error-' + fieldId);
    if (field) field.classList.add('field-invalid');
    if (errEl) errEl.textContent = message;
  }

  /* --- Clear all validation state --- */
  function clearValidation() {
    form.querySelectorAll('.field-invalid').forEach(function (el) {
      el.classList.remove('field-invalid');
    });
    form.querySelectorAll('.field-error').forEach(function (el) {
      el.textContent = '';
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearValidation();

      var valid = true;

      /* --- Honeypot check: bots fill hidden fields, humans don't --- */
      var honeypot = document.getElementById('website');
      if (honeypot && honeypot.value !== '') {
        /* Silent fail – do not reveal the honeypot to the sender */
        return;
      }

      /* --- Read and trim all values --- */
      var nameVal    = document.getElementById('name').value.trim();
      var emailVal   = document.getElementById('email').value.trim();
      var phoneVal   = document.getElementById('phone').value.trim();
      var messageVal = document.getElementById('message').value.trim();

      /* --- Validate: name --- */
      if (!nameVal) {
        setFieldError('name', 'Jméno je povinné.');
        valid = false;
      } else if (nameVal.length < 2) {
        setFieldError('name', 'Jméno musí mít alespoň 2 znaky.');
        valid = false;
      } else if (!/^[\p{L}\s]+$/u.test(nameVal)) {
        setFieldError('name', 'Jméno může obsahovat pouze písmena a mezery.');
        valid = false;
      }

      /* --- Validate: email (if provided) --- */
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (emailVal && !emailRegex.test(emailVal)) {
        setFieldError('email', 'Zadejte platnou e-mailovou adresu.');
        valid = false;
      }

      /* --- Validate: phone (if provided) --- */
      var phoneClean = phoneVal.replace(/[\s\-\(\)]/g, '');
      var phoneRegex = /^(\+420|\+421|00420|00421)?\d{9}$/;
      if (phoneVal && !phoneRegex.test(phoneClean)) {
        setFieldError('phone', 'Zadejte platné telefonní číslo (např. +420 605 812 480).');
        valid = false;
      }

      /* --- Validate: at least phone or email must be filled --- */
      if (!phoneVal && !emailVal) {
        if (!document.getElementById('error-phone').textContent) {
          setFieldError('phone', 'Vyplňte telefon nebo e-mail.');
        }
        if (!document.getElementById('error-email').textContent) {
          setFieldError('email', 'Vyplňte telefon nebo e-mail.');
        }
        valid = false;
      }

      /* --- Validate: message --- */
      if (!messageVal) {
        setFieldError('message', 'Zpráva je povinná.');
        valid = false;
      } else if (messageVal.length < 10) {
        setFieldError('message', 'Zpráva musí mít alespoň 10 znaků.');
        valid = false;
      } else if (messageVal.length > 1000) {
        setFieldError('message', 'Zpráva nesmí přesáhnout 1000 znaků.');
        valid = false;
      }

      if (!valid) {
        var firstInvalid = form.querySelector('.field-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /* --- Disable button during send --- */
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Odesílám…';
      }

      var templateParams = {
        from_name:  sanitizeHtml(nameVal),
        from_phone: sanitizeHtml(phoneVal),
        from_email: emailVal,
        reply_to:   emailVal || '',
        service:    document.getElementById('service').value,
        message:    sanitizeHtml(messageVal),
        to_email:   'tomas.majerciak@gmail.com'
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
