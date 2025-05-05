  // Set a specific background image once all assets are loaded
  window.addEventListener('load', () => {
    const specificImage = 'image.png'; // Change this to your desired image
    document.body.style.backgroundImage = `url('${specificImage}')`;
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
  })();
