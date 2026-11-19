// Live Flash News is managed strictly through the Admin Portal notices table.
// Do not generate synthetic mock fallback tickers.
(() => {
  document.querySelectorAll('[data-flash-welcome-fallback], [data-flash-welcome], .flash-welcome-item').forEach(el => el.remove());
})();
