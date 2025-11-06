// script.js

;(function() {
  const path = window.location.pathname;
  if (/^\/index(?:\.html)?$/.test(path)) {
    history.replaceState(null, '', '/');
  } else if (path.endsWith('.html')) {
    history.replaceState(null, '', path.slice(0, -5));
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const href = link.getAttribute('href');
        const cleanPath = href.replace(/\.html$/, '');
        history.pushState(null, '', cleanPath);
        window.location.href = cleanPath;
      });
    });
    const announcementBar = document.querySelector('.announcement-bar');
    if (announcementBar) {
      const closeButton = announcementBar.querySelector('.announcement-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          announcementBar.classList.add('announcement-hidden');
          setTimeout(() => announcementBar.remove(), 250);
        });
      }
    }
  });

  window.addEventListener('popstate', () => {
    window.location.reload();
  });
})();
