(function () {
  'use strict';

  var bar = document.querySelector('[data-mobile-contact-bar]');
  if (!bar) return;

  var api;
  var styleHash;
  var lastOffset;

  function updateClearance() {
    if (!api || typeof api.adjustStyles !== 'function') return;
    // Measure after safe-area padding, zoom and responsive layout are applied.
    var offset = Math.ceil(bar.getBoundingClientRect().height) + 12;
    if (offset === lastOffset) return;
    if (styleHash && typeof api.removeStyles === 'function') {
      api.removeStyles(styleHash);
    }
    // Official Tidio positioning API; never override desktop placement.
    // https://help.tidio.com/hc/en-us/articles/5464851341724-Widget-Position
    styleHash = api.adjustStyles(
      '@media (max-width: 767px) { #tidio { bottom: ' + offset + 'px !important; } }'
    );
    lastOffset = offset;
  }

  function onReady() {
    api = window.tidioChatApi;
    updateClearance();
  }

  if (window.tidioChatApi) {
    window.tidioChatApi.on('ready', onReady);
  } else {
    document.addEventListener('tidioChat-ready', onReady);
  }

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(updateClearance).observe(bar);
  }
  window.addEventListener('resize', updateClearance);
}());
