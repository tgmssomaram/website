// Flash News scrolls at the SAME speed on every school site, whatever the text length.
// The stylesheet gives the loop a fixed duration, so a short flash message crawled (about 11 px/s) while a long one ran
// at about 51 px/s. Here the duration is derived from the width of one message group: duration = width / speed.
// 51 px/s is the speed the Munagala site has always had (2800 px group, 55 s loop). Change FLASH_PX_PER_SECOND to retune every school.
(() => {
  const FLASH_PX_PER_SECOND = 51;
  const MIN_SECONDS = 6;
  let queued = false;
  function apply() {
    queued = false;
    for (const track of document.querySelectorAll('.model-flash-news .news-track, .bulletin[data-news-kind="flash"] .news-track')) {
      const group = track.querySelector('.news-group');
      const width = group ? group.offsetWidth : 0;
      if (!width || !group.textContent.replace(/✦/g, "").trim()) continue;
      const seconds = Math.max(MIN_SECONDS, width / FLASH_PX_PER_SECOND);
      const current = parseFloat(track.style.animationDuration) || 0;
      if (Math.abs(current - seconds) > seconds * 0.01) track.style.setProperty('animation-duration', seconds.toFixed(2) + 's', 'important');
    }
  }
  function schedule() {
    if (queued) return;
    queued = true;
    setTimeout(apply, 30);
  }
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('load', () => { schedule(); setTimeout(schedule, 800); setTimeout(schedule, 2500); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  window.addEventListener('resize', schedule);
  schedule();
})();
