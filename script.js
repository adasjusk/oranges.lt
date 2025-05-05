// script.js

;(function () {
  // 1) Clean up the URL on initial load
  const path = window.location.pathname;
  if (/^\/index(?:\.html)?$/.test(path)) {
    history.replaceState(null, '', '/');
  } else if (path.endsWith('.html')) {
    history.replaceState(null, '', path.slice(0, -5));
  }

  // 2) Set a specific background image once all assets are loaded
  window.addEventListener('load', () => {
    const specificImage = 'image.png'; // Make sure this path is correct and image exists
    document.body.style.backgroundImage = `url('${specificImage}')`;
    document.body.style.backgroundSize = 'cover'; // Ensures it stretches across screen
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
  });

  // 3) DOM Ready logic
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

    // 4) Copy server IP to clipboard
    const copyIpButton = document.getElementById('copy-ip');
    const ipSpan = document.getElementById('server-ip');
    if (copyIpButton && ipSpan) {
      copyIpButton.addEventListener('click', () => {
        const ipAddress = ipSpan.textContent.trim();
        navigator.clipboard.writeText(ipAddress)
          .then(() => alert('IP Address copied to clipboard!'))
          .catch(err => {
            alert('Failed to copy IP Address.');
            console.error('Clipboard error:', err);
          });
      });
    }
  });

  // 5) Reload on back/forward navigation
  window.addEventListener('popstate', () => {
    window.location.reload();
  });
})();
