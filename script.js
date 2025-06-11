// script.js

;(function() {
  // 1) Clean up the URL on initial load
  const path = window.location.pathname;
  if (/^\/index(?:\.html)?$/.test(path)) {
    history.replaceState(null, '', '/');
  } else if (path.endsWith('.html')) {
    history.replaceState(null, '', path.slice(0, -5));
  }

  // 2) DOM Ready logic
  document.addEventListener('DOMContentLoaded', () => {
    // Intercept .html link clicks
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const href = link.getAttribute('href');
        const cleanPath = href.replace(/\.html$/, '');
        history.pushState(null, '', cleanPath);
        window.location.href = cleanPath;
      });
    });
  }); // Added missing closing brace

  // 3) Handle back/forward navigation
  window.addEventListener('popstate', () => {
    window.location.reload();
  });
})();
