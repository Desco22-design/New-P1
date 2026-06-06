/* ============================================================
   PAGE LOAD
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    document.body.classList.remove('loading');
  }, 80);
});

/* ============================================================
   STICKY HEADER — backdrop blur + shadow
   ============================================================ */
(function () {
  var topbar = document.getElementById('topbar');
  if (!topbar) return;

  function onScroll() {
    if (window.scrollY > 8) {
      topbar.classList.add('scrolled');
    } else {
      topbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   SCROLL REVEAL — Intersection Observer
   ============================================================ */
(function () {
  var revealEls   = document.querySelectorAll('[data-reveal]');
  var staggerEls  = document.querySelectorAll('[data-stagger]');

  var options = {
    threshold: 0.1,
    rootMargin: '0px 0px -56px 0px'
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  revealEls.forEach(function (el) { observer.observe(el); });
  staggerEls.forEach(function (el) { observer.observe(el); });
})();

/* ============================================================
   STATS COUNTER ANIMATION
   ============================================================ */
(function () {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function formatNum(n, useSpace) {
    if (!useSpace) return n.toLocaleString('ru-RU').replace(/,/g, ' ');
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function animateCounter(el) {
    var target  = parseInt(el.dataset.count, 10);
    var suffix  = el.dataset.suffix || '';
    var format  = el.dataset.format === 'space';
    var duration = 2200;
    var start    = null;

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var val = Math.floor(easeOutCubic(progress) * target);
      el.textContent = formatNum(val, format) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNum(target, format) + suffix;
    }
    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { statsObserver.observe(el); });
})();

/* ============================================================
   HERO SLIDER
   ============================================================ */
(function () {
  var slides  = document.querySelectorAll('.hero-slide');
  var dots    = document.querySelectorAll('#heroDots .dot');
  var prevBtn = document.getElementById('heroPrev');
  var nextBtn = document.getElementById('heroNext');
  var track   = document.getElementById('heroSlidesTrack');

  if (!track || !slides.length) return;

  var current = 0;
  var timer   = null;
  var count   = slides.length;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + count) % count;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
  }

  function startAuto() {
    timer = setInterval(function () { goTo(current + 1); }, 5500);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); resetAuto(); });
  });

  /* Touch/swipe support */
  var touchStartX = 0;
  var sliderEl = document.querySelector('.hero__slider');
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    sliderEl.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
        resetAuto();
      }
    }, { passive: true });
  }

  startAuto();
})();

/* ============================================================
   PRODUCTS CAROUSEL
   ============================================================ */
(function () {
  var track   = document.getElementById('productsTrack');
  var prevBtn = document.getElementById('productsPrev');
  var nextBtn = document.getElementById('productsNext');
  if (!track) return;

  var STEP   = 230;
  var offset = 0;

  function maxOffset() {
    return Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
  }

  function slide(dir) {
    offset = Math.max(0, Math.min(offset + dir * STEP * 2, maxOffset()));
    track.style.transform = 'translateX(-' + offset + 'px)';
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { slide(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { slide(1); });
})();

/* ============================================================
   NEWS CAROUSEL
   ============================================================ */
(function () {
  var track   = document.getElementById('newsTrack');
  var prevBtn = document.getElementById('newsPrev');
  var nextBtn = document.getElementById('newsNext');
  if (!track) return;

  var STEP   = 406;
  var offset = 0;

  function maxOffset() {
    return Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
  }

  function slide(dir) {
    offset = Math.max(0, Math.min(offset + dir * STEP, maxOffset()));
    track.style.transform = 'translateX(-' + offset + 'px)';
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { slide(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { slide(1); });
})();

/* ============================================================
   SMOOTH ANCHOR SCROLL
   ============================================================ */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var offset = 140;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();

/* ============================================================
   FORM SUBMIT FEEDBACK
   ============================================================ */
(function () {
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (!btn || btn.disabled) return;
      var orig = btn.innerHTML;
      btn.innerHTML = 'Отправлено ✓';
      btn.disabled = true;
      btn.style.background = 'linear-gradient(135deg, #2a6a2a 0%, #1f5c1f 100%)';
      setTimeout(function () {
        btn.innerHTML = orig;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3500);
    });
  });
})();

/* ============================================================
   MEASURE BAR — inputs animation
   ============================================================ */
(function () {
  document.querySelectorAll('.input--round').forEach(function (input) {
    input.addEventListener('focus', function () {
      this.parentElement && (this.parentElement.style.zIndex = '1');
    });
    input.addEventListener('blur', function () {
      this.parentElement && (this.parentElement.style.zIndex = '');
    });
  });
})();

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
(function () {
  var bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY;
    var total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });
})();


/* ============================================================
   SCROLL TO TOP
   ============================================================ */
(function () {
  var btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.btn--dark, .nav-btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r  = btn.getBoundingClientRect();
      var dx = (e.clientX - r.left - r.width  / 2) * 0.28;
      var dy = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });
})();

/* ============================================================
   3D CARD TILT
   ============================================================ */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.offer-card, .review-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width  - 0.5;
      var y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = 'perspective(900px) rotateX(' + (-y * 7) + 'deg) rotateY(' + (x * 7) + 'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
})();

/* ============================================================
   PARTNERS MARQUEE — duplicate items for infinite loop
   ============================================================ */
(function () {
  var track = document.querySelector('.partners__track');
  if (!track) return;

  var overflow = document.createElement('div');
  overflow.className = 'partners__overflow';
  track.parentNode.insertBefore(overflow, track);
  overflow.appendChild(track);

  var items = Array.from(track.children);
  items.forEach(function (item) {
    var clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.style.opacity    = '1';
    clone.style.transform  = 'none';
    clone.style.transition = 'none';
    track.appendChild(clone);
  });
})();

/* ============================================================
   MOBILE MENU
   ============================================================ */
(function () {
  var hamburger = document.getElementById('hamburgerBtn');
  var menu      = document.getElementById('mobileMenu');
  var backdrop  = document.getElementById('mobileMenuBackdrop');
  var closeBtn  = document.getElementById('mobileMenuClose');
  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    backdrop.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    backdrop.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    backdrop.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (menu.classList.contains('open')) closeMenu(); else openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
})();

/* ============================================================
   HERO MOUSE PARALLAX ON ORBS
   ============================================================ */
(function () {
  var orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;
  var hero = document.querySelector('.hero__slider');
  if (!hero) return;

  hero.addEventListener('mousemove', function (e) {
    var r  = hero.getBoundingClientRect();
    var cx = r.left + r.width  / 2;
    var cy = r.top  + r.height / 2;
    var dx = (e.clientX - cx) / cx;
    var dy = (e.clientY - cy) / cy;
    orbs.forEach(function (orb, i) {
      var depth = (i + 1) * 12;
      orb.style.transform = 'translate(' + (dx * depth) + 'px, ' + (dy * depth) + 'px)';
    });
  });
  hero.addEventListener('mouseleave', function () {
    orbs.forEach(function (orb) { orb.style.transform = ''; });
  });
})();
