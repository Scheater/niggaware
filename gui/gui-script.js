// Tab-Management: Tabs aktivieren und Inhalte umschalten
const tabs = document.querySelectorAll('.gui-sidebar nav ul li');
const tabContents = document.querySelectorAll('.tab');

// Funktion: Tab wechseln
function switchTab(tabId) {
    // Alle Tabs deaktivieren
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Aktuellen Tab und Inhalt aktivieren
    const activeTab = document.querySelector(`.gui-sidebar nav ul li[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);

    if (activeTab && activeContent) {
        activeTab.classList.add('active');
        activeContent.classList.add('active');
    }
}

// Event-Listener: Klick auf Tabs
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        switchTab(tabId);
    });
});

// Tooltip-Logik: Tooltips für interaktive Elemente
const settings = document.querySelectorAll('.setting');
settings.forEach(setting => {
    let tooltipTimeout;

    // Tooltip erstellen
    const tooltipText = setting.querySelector('span').textContent;
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = tooltipText;
    document.body.appendChild(tooltip);

    // Tooltip beim Hover anzeigen
    setting.addEventListener('mouseenter', e => {
        tooltipTimeout = setTimeout(() => {
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = `${rect.right + 10}px`; // Rechts neben dem Element
            tooltip.style.top = `${rect.top}px`;
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        }, 500); // Verzögerung von 500ms
    });

    // Tooltip beim Verlassen ausblenden
    setting.addEventListener('mouseleave', () => {
        clearTimeout(tooltipTimeout);
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
    });
});

// Slider-Logik: Dynamisches Feedback
const sliders = document.querySelectorAll('input[type="range"]');
sliders.forEach(slider => {
    const sliderValue = document.createElement('span');
    sliderValue.classList.add('slider-value');
    sliderValue.textContent = slider.value;
    slider.parentNode.appendChild(sliderValue);

    // Wert aktualisieren, wenn der Slider bewegt wird
    slider.addEventListener('input', () => {
        sliderValue.textContent = slider.value;
    });
});

// Checkbox-Logik: Checkboxen an/aus
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const isChecked = checkbox.checked;
        const label = checkbox.parentNode.querySelector('span');
        if (isChecked) {
            label.style.color = '#b30000'; // Rot, wenn aktiviert
        } else {
            label.style.color = ''; // Standardfarbe, wenn deaktiviert
        }
    });
});

// Schließen-Button
const closeButton = document.querySelector('.gui-header .close-btn');
closeButton.addEventListener('click', () => {
    const guiWrapper = document.querySelector('.gui-wrapper');
    guiWrapper.style.transform = 'scale(0)';
    guiWrapper.style.opacity = '0';
    setTimeout(() => {
        guiWrapper.style.display = 'none';
    }, 300); // Animation abwarten
});

// Initialer Zustand: Standard-Tab aktivieren
if (tabs.length > 0) {
    const defaultTabId = tabs[0].getAttribute('data-tab');
    switchTab(defaultTabId);
}
