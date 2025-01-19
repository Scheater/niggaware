// Carousel Logic
const slides = document.querySelectorAll('.carousel-slide img');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const indicators = document.querySelectorAll('.indicator');

let currentIndex = 0;

function updateCarousel(index) {
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.style.transform = `translateX(-${index * 100}%)`;

    indicators.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel(currentIndex);
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel(currentIndex);
});

indicators.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel(currentIndex);
    });
});

// Auto-slide
setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel(currentIndex);
}, 5000);

// Tooltip Logic
const features = document.querySelectorAll('.feature-card ul li');

features.forEach((feature) => {
    let tooltipTimeout;

    const tooltipText = feature.getAttribute('data-tooltip');
    const tooltip = document.createElement('span');
    tooltip.classList.add('tooltip');
    tooltip.textContent = tooltipText;
    feature.appendChild(tooltip);

    feature.addEventListener('mouseenter', () => {
        tooltipTimeout = setTimeout(() => {
            tooltip.classList.add('show-tooltip');
        }, 500);
    });

    feature.addEventListener('mouseleave', () => {
        clearTimeout(tooltipTimeout);
        tooltip.classList.remove('show-tooltip');
    });
});
