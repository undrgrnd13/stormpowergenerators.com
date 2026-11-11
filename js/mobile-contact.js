(function () {
  'use strict';

  // Loaded only by financing and the three postcard landing pages.
  // Keeps the Tidio chat bubble from covering buttons on phones.
  // Official Tidio positioning API (adjustStyles / removeStyles):
  // https://help.tidio.com/hc/en-us/articles/5464851341724-Widget-Position

  var bar = document.querySelector('[data-mobile-contact-bar]');
  if (!bar) return;

  var MOBILE = window.matchMedia('(max-width: 767px)');
  var BUBBLE_SIZE = 64;   // closed bubble incl. margin, used if the frame can't be measured
  var BUBBLE_RIGHT = 16;
  var GAP = 8;            // extra room kept around buttons

  var api;
  var offsetHash;
  var lastOffset;
  var hideHash;
  var chatOpen = false;
  var ticking = false;

  function barHeight() {
    return Math.ceil(bar.getBoundingClientRect().height);
  }

  // 1) Lift the bubble above the fixed Call / Text / Request bar.
  function updateClearance() {
    if (!api) return;
    var offset = barHeight() + 12;
    if (offset === lastOffset) return;
    if (offsetHash) api.removeStyles(offsetHash);
    offsetHash = api.adjustStyles(
      '@media (max-width: 767px) { #tidio { bottom: ' + offset + 'px !important; } }'
    );
    lastOffset = offset;
  }

  // Where the closed bubble sits on screen.
  function bubbleRect() {
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    var el = document.getElementById('tidio-chat-iframe') || document.getElementById('tidio');
    if (el) {
      var r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.width <= 160 && r.height <= 160) {
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
      }
    }
    var bottom = vh - (lastOffset || barHeight() + 12);
    return {
      left: vw - BUBBLE_RIGHT - BUBBLE_SIZE,
      right: vw - BUBBLE_RIGHT,
      top: bottom - BUBBLE_SIZE,
      bottom: bottom
    };
  }

  // 2) While a page button or link scrolls under the bubble, fade the
  //    bubble out so the button can be seen and tapped. It comes back as
  //    soon as the button moves on. Never hides an open chat.
  function setHidden(hide) {
    if (hide && !hideHash) {
      hideHash = api.adjustStyles(
        '@media (max-width: 767px) { #tidio { opacity: 0 !important; pointer-events: none !important; transition: opacity .15s ease !important; } }'
      );
    } else if (!hide && hideHash) {
      api.removeStyles(hideHash);
      hideHash = null;
    }
  }

  function checkOverlap() {
    ticking = false;
    if (!api) return;
    if (!MOBILE.matches || chatOpen) { setHidden(false); return; }
    var b = bubbleRect();
    var targets = document.querySelectorAll('a[href], button, input[type="submit"]');
    var hit = false;
    for (var i = 0; i < targets.length && !hit; i++) {
      var t = targets[i];
      if (bar.contains(t)) continue;
      var r = t.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.left < b.right + GAP && r.right > b.left - GAP &&
          r.top < b.bottom + GAP && r.bottom > b.top - GAP) {
        hit = true;
      }
    }
    setHidden(hit);
  }

  function schedule() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(checkOverlap);
  }

  function refresh() {
    updateClearance();
    schedule();
  }

  function onReady() {
    api = window.tidioChatApi;
    if (!api || typeof api.adjustStyles !== 'function' || typeof api.removeStyles !== 'function') {
      api = null;
      return;
    }
    if (typeof api.on === 'function') {
      api.on('open', function () { chatOpen = true; setHidden(false); });
      api.on('close', function () { chatOpen = false; schedule(); });
    }
    refresh();
    // Re-check once layout and the widget have settled.
    setTimeout(refresh, 500);
    setTimeout(refresh, 2000);
  }

  if (window.tidioChatApi) {
    window.tidioChatApi.on('ready', onReady);
  } else {
    document.addEventListener('tidioChat-ready', onReady);
  }

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(refresh).observe(bar);
  }
  window.addEventListener('resize', refresh);
  window.addEventListener('scroll', schedule, { passive: true });
}());
