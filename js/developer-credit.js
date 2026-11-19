// Preserve school footer content and display Chippa Rishikesh developer credit with email
(()=>{
  const name = 'Chippa Rishikesh';
  const email = 'rishikesh.ch2006@gmail.com';
  let queued = false;

  function apply() {
    queued = false;
    for (const footer of document.querySelectorAll('footer')) {
      // Remove any phone links/text from footer
      footer.querySelectorAll('a[href^="tel:"], [href*="tel:"]').forEach(a => a.remove());
      for (const el of footer.querySelectorAll('a, p, span, div, small, li')) {
        if (/(?:08727-285222|7013641846|☎|Ph:)/i.test(el.textContent)) {
          el.remove();
        }
      }

      if (footer.querySelector("[data-developer-name='Chippa Rishikesh']") || footer.querySelector('.school-footer-bottom')) continue;

      // Clean up previous developer credits
      footer.querySelectorAll('.developer-credit, [data-developer-name]').forEach(e => e.remove());
      for (const el of footer.querySelectorAll('p, div, span, b, strong, a')) {
        if (/Chittiprolu|srinus618|7013641846|veda\s*tech/i.test(el.textContent)) {
          el.remove();
        }
      }

      const credit = document.createElement('div');
      credit.className = 'developer-credit';
      credit.style.cssText = 'margin:14px 0 6px;font-size:14px;color:#374151;line-height:1.6;';

      const label = document.createElement('div');
      label.textContent = 'Designed & developed by';
      label.style.cssText = 'color:#6b7280;font-size:13px;';

      const author = document.createElement('strong');
      author.dataset.developerName = 'Chippa Rishikesh';
      author.textContent = name;
      author.translate = false;
      author.className = 'notranslate';
      author.style.cssText = 'display:block;font-size:17px;font-weight:750;color:#0f3b2d;margin-top:2px;';

      const emailLink = document.createElement('a');
      emailLink.href = 'mailto:' + email;
      emailLink.textContent = email;
      emailLink.style.cssText = 'display:inline-block;margin-top:4px;color:#15543e;font-weight:600;text-decoration:underline;font-size:13px;';

      credit.append(label, author, emailLink);
      footer.append(credit);
    }
  }

  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(apply);
    }
  }

  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  addEventListener('hashchange', schedule);
  schedule();
})();
