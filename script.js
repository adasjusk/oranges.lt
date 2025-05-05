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

  // Set a specific background image once all assets are loaded
  window.addEventListener('load', () => {
    const specificImage = 'image.png'; // Change this to your desired image
    document.body.style.backgroundImage = `url('${specificImage}')`;
  });


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

    // 4) Copy server IP to clipboard
    const copyIpButton = document.getElementById('copy-ip');
    if (copyIpButton) {
      copyIpButton.addEventListener('click', () => {
        const ipAddress = document.getElementById('server-ip').textContent;
        navigator.clipboard.writeText(ipAddress)
          .then(() => alert('IP Address copied to clipboard!'))
          .catch(err => console.error('Failed to copy IP Address:', err));
      });
    }
  });

  // 5) Handle Back/Forward navigation by reloading the page
  window.addEventListener('popstate', () => {
    window.location.reload();
  });
})();
