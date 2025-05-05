// script.js

;(function() {
  // 1) Clean up the URL on initial load
  const path = window.location.pathname;
  if (/^\/index(?:\.html)?$/.test(path)) {
    // /index.html or /index → /
    history.replaceState(null, '', '/');
  } else if (path.endsWith('.html')) {
    // /page.html → /page
    history.replaceState(null, '', path.slice(0, -5));
  }

  document.addEventListener('DOMContentLoaded', () => {
    // 3) Intercept clicks on .html links to use clean URLs
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const href = link.getAttribute('href');
        const cleanPath = href.replace(/\.html$/, '');
        history.pushState(null, '', cleanPath);
        // Let GitHub Pages serve the correct .html file
        window.location.href = cleanPath;
      });
    });

  // 5) Handle Back/Forward navigation by reloading the page
  window.addEventListener('popstate', () => {
    window.location.reload();
  });
})();
