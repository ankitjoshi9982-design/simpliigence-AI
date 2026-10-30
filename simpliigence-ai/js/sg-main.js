/* ============================================================
   SIMPLIIGENCE AI — shared UI behavior (nav + footer are now
   server-rendered in header.php/footer.php; this file only
   handles interaction, not markup injection, which is better
   for SEO/CLS/speed than the old client-injected version).
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Nav behavior ---------- */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    var onScroll = function () { navbar.classList.toggle('scrolled', window.scrollY > 24); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var mobileNav = document.getElementById('mobileNav');
  var hamburger = document.getElementById('hamburger');
  var mobileClose = document.getElementById('mobileClose');
  if (mobileNav && hamburger) {
    hamburger.addEventListener('click', function () { mobileNav.classList.add('open'); });
    if (mobileClose) mobileClose.addEventListener('click', function () { mobileNav.classList.remove('open'); });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobileNav.classList.remove('open'); });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) { io.observe(el); });

  /* ---------- Animated counters ---------- */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; cio.unobserve(el);
      var target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '', dec = el.dataset.dec ? 1 : 0;
      var start = performance.now(), dur = 1800;
      var tick = function (now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  /* ---------- Card cursor glow ---------- */
  document.addEventListener('pointermove', function (e) {
    var card = e.target.closest('.card');
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  }, { passive: true });

  /* ---------- FAQ / industry accordions (.accordion-item > .accordion-head + .accordion-body) ---------- */
  document.addEventListener('click', function (e) {
    var head = e.target.closest('.accordion-head');
    if (!head) return;
    var item = head.closest('.accordion-item');
    var bodyEl = item.querySelector('.accordion-body');
    var open = item.classList.toggle('open');
    head.setAttribute('aria-expanded', open);
    bodyEl.style.maxHeight = open ? bodyEl.scrollHeight + 'px' : '0';
  });

  /* ---------- Toast ---------- */
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    document.getElementById('toastMsg').textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 3800);
  }

  /* ---------- Lead capture → WordPress AJAX ---------- */
  function submitLead(data) {
    var body = new URLSearchParams(Object.assign({ action: 'sgai_capture_lead', nonce: (window.SGAI && SGAI.nonce) || '' }, data));
    return fetch((window.SGAI && SGAI.ajaxUrl) || '/wp-admin/admin-ajax.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    }).then(function (res) { return res.json(); }).then(function (json) { return !!json.success; }).catch(function () { return false; });
  }

  /* Contact form (page-contact.php) */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target;
      submitLead({
        name: f.name.value, email: f.email.value, company: f.company.value, phone: f.phone.value,
        type: f.type.value, size: f.size.value, process: f.process.value, source: 'contact'
      }).then(function (ok) {
        var confirmEl = document.getElementById('contactConfirm');
        if (ok && confirmEl) {
          f.closest('.contact-form-wrap').style.display = 'none';
          confirmEl.style.display = 'block';
        } else if (!ok) {
          toast('Something went wrong — please try again, or email hello@simpliigence.ai.');
        }
      });
    });

    // Pre-fill from URL params, e.g. ?type=Book+an+AI+Health+Check&interest=AI+Agents
    var params = new URLSearchParams(window.location.search);
    if (params.get('type') && contactForm.type) contactForm.type.value = params.get('type');
  }

  window.SG_UI = { toast: toast, submitLead: submitLead };
})();
