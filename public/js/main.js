/* ==========================================================================
   Site behaviour. You should not need to edit this file to add work.
   Projects live in js/data.js.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover     = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── video sources ──────────────────────────────────────────────────
     Works out whether a `video` value is YouTube, Vimeo or a plain file,
     so you can paste any of them into data.js without thinking about it. */

  function readVideo(url) {
    if (!url) return null;
    var u = String(url).trim();
    if (!u) return null;

    var yt = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    if (yt) return { kind: 'youtube', id: yt[1] };

    var vm = u.match(/vimeo\.com\/(?:video\/|channels\/[^/]+\/|groups\/[^/]+\/videos\/)?(\d+)/);
    if (vm) return { kind: 'vimeo', id: vm[1] };

    return { kind: 'file', src: u };
  }

  function embedSrc(v) {
    if (v.kind === 'youtube') {
      return 'https://www.youtube-nocookie.com/embed/' + v.id +
             '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    }
    return 'https://player.vimeo.com/video/' + v.id +
           '?autoplay=1&title=0&byline=0&portrait=0&dnt=1';
  }

  var PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ── project cards ──────────────────────────────────────────────────── */

  var grid      = $('#grid');
  var gridEmpty = $('#gridEmpty');
  var projects  = (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) ? PROJECTS : [];

  function cardMarkup(p, i) {
    var size = ({ lg: 'card--lg', sm: 'card--sm', md: 'card--md' })[p.size] || 'card--md';
    var tags = (p.tags || []).join(' ');
    var dur  = p.duration ? '<span class="card__dur">' + esc(p.duration) + '</span>' : '';

    return '' +
      '<article class="card ' + size + ' reveal" data-tags="' + esc(tags) + '" data-i="' + i + '"' +
              ' style="transition-delay:' + Math.min(i, 5) * 70 + 'ms">' +
        '<div class="card__media">' +
          '<img class="card__img" src="' + esc(p.thumbnail) + '" alt="' + esc(p.alt || p.title) + '"' +
              ' width="1600" height="900" loading="lazy" decoding="async">' +
          '<span class="card__scrim"></span>' +
          '<span class="card__play">' + PLAY_ICON + '</span>' +
          dur +
        '</div>' +
        '<div class="card__rule"></div>' +
        '<div class="card__body">' +
          '<h3 class="card__title">' + esc(p.title) + '</h3>' +
          '<p class="card__cat">' + esc(p.category) + '</p>' +
          '<p class="card__desc">' + esc(p.description) + '</p>' +
          '<span class="card__cta">Watch project<i></i></span>' +
        '</div>' +
        '<button class="card__hit" aria-label="Watch project: ' + esc(p.title) + '"></button>' +
      '</article>';
  }

  if (grid) {
    grid.innerHTML = projects.map(cardMarkup).join('');

    grid.addEventListener('click', function (e) {
      var hit = e.target.closest('.card__hit');
      if (!hit) return;
      var card = hit.closest('.card');
      openLightbox(projects[Number(card.dataset.i)], hit);
    });
  }

  /* ── silent hover previews ──────────────────────────────────────────── */

  function wirePreview(root, project, playingClass) {
    if (!canHover || reduceMotion || !project.preview) return;
    var media = $('.card__media', root) || $('.feat__media', root);
    if (!media) return;
    var vid = null;

    root.addEventListener('mouseenter', function () {
      if (!vid) {
        vid = document.createElement('video');
        vid.className = $('.card__media', root) ? 'card__vid' : '';
        vid.muted = true; vid.loop = true; vid.playsInline = true;
        vid.setAttribute('muted', '');
        vid.setAttribute('playsinline', '');
        vid.preload = 'none';
        vid.setAttribute('aria-hidden', 'true');
        vid.src = project.preview;
        media.appendChild(vid);
      }
      var go = vid.play();
      if (go && go.catch) go.catch(function () {});
      root.classList.add(playingClass);
    });

    root.addEventListener('mouseleave', function () {
      root.classList.remove(playingClass);
      if (vid) { vid.pause(); vid.currentTime = 0; }
    });
  }

  $$('.card').forEach(function (card) {
    wirePreview(card, projects[Number(card.dataset.i)] || {}, 'is-preview');
  });

  /* ── filters ────────────────────────────────────────────────────────── */

  var filters = $$('.filter');

  function applyFilter(name) {
    var shown = 0;

    $$('.card').forEach(function (card) {
      var tags = (card.dataset.tags || '').split(' ');
      var ok = name === 'all' || tags.indexOf(name) !== -1;
      card.hidden = !ok;
      if (ok) shown++;
    });

    filters.forEach(function (b) {
      var on = b.dataset.filter === name;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    if (gridEmpty) gridEmpty.hidden = shown !== 0;
  }

  filters.forEach(function (b) {
    b.addEventListener('click', function () { applyFilter(b.dataset.filter); });
  });

  $$('[data-jump]').forEach(function (b) {
    b.addEventListener('click', function () {
      applyFilter(b.dataset.jump);
      var work = $('#work');
      if (work) work.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // Run once so the empty-state message is correct even before any click.
  applyFilter('all');

  /* ── featured project ───────────────────────────────────────────────── */

  var featStage = $('#featStage');

  if (featStage && typeof FEATURED !== 'undefined' && FEATURED) {
    var f = FEATURED;
    var fDur = f.duration ? '<span class="card__dur">' + esc(f.duration) + '</span>' : '';

    featStage.innerHTML =
      '<div class="feat__media">' +
        '<img src="' + esc(f.thumbnail) + '" alt="' + esc(f.alt || f.title) + '"' +
            ' width="2100" height="900" loading="lazy" decoding="async">' +
        '<span class="card__scrim"></span>' +
        '<span class="feat__play">' + PLAY_ICON + '</span>' +
        fDur +
      '</div>' +
      '<button class="feat__hit" aria-label="Watch project: ' + esc(f.title) + '"></button>';

    $('#featTitle').textContent = f.title || '';
    $('#featCat').textContent   = f.category || '';

    var bd = (f.breakdown || []).map(function (b) {
      return '<div><dt>' + esc(b.label) + '</dt><dd>' + esc(b.text) + '</dd></div>';
    }).join('');

    var featBreak = $('#featBreak');
    featBreak.innerHTML = bd;

    var ctaWrap = document.createElement('div');
    ctaWrap.className = 'feat__cta';
    ctaWrap.innerHTML = '<button class="btn btn--solid" id="featCta">Watch project</button>';
    $('#featCat').insertAdjacentElement('afterend', ctaWrap);

    var openFeat = function (trigger) { openLightbox(f, trigger); };
    $('.feat__hit', featStage).addEventListener('click', function (e) { openFeat(e.currentTarget); });
    $('#featCta').addEventListener('click', function (e) { openFeat(e.currentTarget); });

    wirePreview(featStage, f, 'is-preview');
  }

  /* ── lightbox ───────────────────────────────────────────────────────── */

  var lb       = $('#lb');
  var lbFrame  = $('#lbFrame');
  var lbTitle  = $('#lbTitle');
  var lbCat    = $('#lbCat');
  var lbNote   = $('#lbNote');
  var lbClose  = $('#lbClose');
  var lastFocus = null;

  var pageHeader = $('#nav');
  var pageMain   = $('main');
  var pageFooter = $('.foot');

  /* Marking the rest of the page inert is what actually keeps Tab inside an
     overlay. A keydown trap alone leaks once focus enters a video iframe. */
  function setInert(els, on) {
    els.forEach(function (el) {
      if (!el) return;
      if (on) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    });
  }

  function openLightbox(project, trigger) {
    if (!project || !lb) return;
    lastFocus = trigger || document.activeElement;

    lbTitle.textContent = project.title || '';
    lbCat.textContent   = project.category || '';
    lbNote.textContent  = project.format ? 'Format: ' + project.format : '';

    var tall = /^9\s*[:x/]\s*16$/i.test(String(project.format || ''));
    lbFrame.classList.toggle('lb__frame--tall', tall);

    var v = readVideo(project.video);

    if (!v) {
      lbFrame.innerHTML =
        '<div class="lb__placeholder">' +
          '<strong>No video linked yet</strong>' +
          '<span>Open <b>public/js/data.js</b> and paste a YouTube link, a Vimeo link, ' +
          'or a path like assets/videos/your-ad.mp4 into this project’s <b>video</b> field.</span>' +
        '</div>';
    } else if (v.kind === 'file') {
      lbFrame.innerHTML =
        '<video controls autoplay playsinline preload="metadata" ' +
               'poster="' + esc(project.thumbnail || '') + '">' +
          '<source src="' + esc(v.src) + '" type="video/mp4">' +
          'Your browser cannot play this video.' +
        '</video>';
    } else {
      lbFrame.innerHTML =
        '<iframe src="' + esc(embedSrc(v)) + '" title="' + esc(project.title || 'Project video') + '" ' +
                'allow="autoplay; fullscreen; picture-in-picture; encrypted-media" ' +
                'allowfullscreen loading="lazy"></iframe>';
    }

    lb.hidden = false;
    document.body.classList.add('is-locked');
    setInert([pageHeader, pageMain, pageFooter], true);
    lbClose.focus();
    document.addEventListener('keydown', onKey);
  }

  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lbFrame.innerHTML = '';          // stops playback in every case
    lb.hidden = true;

    setInert([pageHeader], false);
    // The mobile menu may still be open behind it, so only release the page
    // if nothing else is holding it.
    if (!menu || menu.hidden) {
      setInert([pageMain, pageFooter], false);
      document.body.classList.remove('is-locked');
    }

    document.removeEventListener('keydown', onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') { closeLightbox(); return; }
    if (e.key !== 'Tab') return;

    var focusables = $$('button, [href], iframe, video[controls], input, select, textarea', lb)
      .filter(function (el) { return el.offsetParent !== null || el.tagName === 'IFRAME'; });
    if (!focusables.length) return;

    var first = focusables[0];
    var last  = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  if (lb) {
    lbClose.addEventListener('click', closeLightbox);
    $$('[data-close]', lb).forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });
  }

  /* ── navigation ─────────────────────────────────────────────────────── */

  var nav     = $('#nav');
  var burger  = $('#burger');
  var menu    = $('#mobilemenu');

  var onScroll = function () {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    if (!menu || !burger) return;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', open);
    // The header stays active so the close button is still reachable.
    setInert([pageMain, pageFooter], open);
    if (open) { var a = $('a', menu); if (a) a.focus(); }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(menu.hidden);
    });
  }

  if (menu) {
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && !menu.hidden) { setMenu(false); burger.focus(); }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 860 && menu && !menu.hidden) setMenu(false);
  });

  /* ── active nav link ────────────────────────────────────────────────── */

  var navLinks = $$('.nav__links a');
  var watched  = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if (watched.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-here', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    watched.forEach(function (s) { spy.observe(s); });
  }

  /* ── reveals ────────────────────────────────────────────────────────── */

  var revealables = $$('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .12 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ── footer year ────────────────────────────────────────────────────── */

  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
