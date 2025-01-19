// Select the download button
const downloadBtn = document.querySelector('.download-btn');

// Add a click event listener to the button
downloadBtn.addEventListener('click', () => {
    // Display an alert to simulate a download start
    alert('Your download will start shortly...');

    // Change button text and style for a "preparing" effect
    downloadBtn.textContent = 'Preparing...';
    downloadBtn.style.backgroundColor = '#666'; // Temporary grey color
    downloadBtn.style.cursor = 'not-allowed'; // Show that it's processing

    // Add a temporary shake animation to the button
    downloadBtn.classList.add('shake');

    // Reset the button after 3 seconds
    setTimeout(() => {
        downloadBtn.textContent = 'Download Now';
        downloadBtn.style.backgroundColor = '#ff1a1a'; // Original red color
        downloadBtn.style.cursor = 'pointer'; // Enable pointer again
        downloadBtn.classList.remove('shake'); // Remove the animation
    }, 3000);
});
