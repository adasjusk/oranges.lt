// script.js
window.onload = function() {
    const images = ['image.png', 'image2.png'];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.body.style.backgroundImage = `url('${randomImage}')`;
};

document.addEventListener('DOMContentLoaded', () => {
    const copyIpButton = document.getElementById('copy-ip');
    copyIpButton.addEventListener('click', () => {
        const ipAddress = document.getElementById('server-ip').textContent;
        navigator.clipboard.writeText(ipAddress).then(() => {
            alert('IP Address copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy IP Address: ', err);
        });
    });
}); 