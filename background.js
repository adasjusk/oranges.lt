document.addEventListener('DOMContentLoaded', function() {
    const images = ['img1.png', 'img2.png', 'img3.png'];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const backgroundImage = `url('img/${randomImage}')`;
    
    // Set both the CSS variable and direct background image
    document.documentElement.style.setProperty('--bg-image', backgroundImage);
    
    // Create and style the background element if it doesn't exist
    const bgElement = document.createElement('div');
    bgElement.className = 'background-overlay';
    document.body.insertBefore(bgElement, document.body.firstChild);
});
