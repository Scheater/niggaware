// Select all feature list items
const features = document.querySelectorAll('.category ul li');

features.forEach((feature) => {
    let tooltipTimeout;

    // Create the tooltip element
    const tooltipText = feature.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = tooltipText;
    feature.appendChild(tooltip);

    // Show the tooltip with a delay when hovering
    feature.addEventListener('mouseenter', () => {
        tooltipTimeout = setTimeout(() => {
            tooltip.classList.add('show-tooltip');
        }, 500); // Delay of 500ms
    });

    // Hide the tooltip when the mouse leaves
    feature.addEventListener('mouseleave', () => {
        clearTimeout(tooltipTimeout);
        tooltip.classList.remove('show-tooltip');
    });
});
