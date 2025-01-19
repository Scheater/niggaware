// Karussell-Elemente auswählen
const carouselWrapper = document.querySelector('.carousel-wrapper');
const items = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

let currentIndex = 0; // Derzeit angezeigtes Bild (Startindex)

// Funktion: Karussell aktualisieren
function updateCarousel() {
    // Verschiebe das Karussell, um nur das aktuelle Bild anzuzeigen
    carouselWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    carouselWrapper.style.transition = "transform 0.5s ease-in-out"; // Sanfte Animation
}

// Event-Listener: "Weiter"-Button
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length; // Zurück zum ersten Bild, wenn am Ende
    updateCarousel();
});

// Event-Listener: "Zurück"-Button
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length; // Zum letzten Bild, wenn vor dem ersten
    updateCarousel();
});

// Automatisches Wechseln der Bilder alle 5 Sekunden
setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
}, 5000);

// Tooltip-Logik: Tooltips für die Features erstellen
const features = document.querySelectorAll('.feature-card ul li');

features.forEach((feature) => {
    let tooltipTimeout;

    // Tooltip-Daten abrufen
    const tooltipText = feature.getAttribute('data-tooltip');
    const tooltip = document.createElement('span'); // Tooltip-Element erstellen
    tooltip.classList.add('tooltip');
    tooltip.textContent = tooltipText;
    document.body.appendChild(tooltip); // Tooltip zum Body hinzufügen

    // Tooltip mit einer Verzögerung anzeigen und an die Mausposition anpassen
    feature.addEventListener('mouseenter', (e) => {
        tooltipTimeout = setTimeout(() => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        }, 500); // Verzögerung von 500ms
    });

    // Tooltip an die Mausposition binden
    feature.addEventListener('mousemove', (e) => {
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        // Tooltip neben der Maus positionieren
        tooltip.style.left = `${e.pageX + 15}px`;
        tooltip.style.top = `${e.pageY - tooltipHeight / 2}px`;
    });

    // Tooltip ausblenden, wenn die Maus das Element verlässt
    feature.addEventListener('mouseleave', () => {
        clearTimeout(tooltipTimeout); // Verzögerung abbrechen
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    });
});
