document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.sidebar button[data-target]');
    const sections = document.querySelectorAll('.option-section');
    const saveChangesButton = document.getElementById("saveChanges");

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            button.classList.add('active');
            const targetSection = document.getElementById(button.dataset.target);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    const textarea = document.querySelector('textarea');
    const customStyle = document.createElement('style');
    document.head.appendChild(customStyle);

    if (textarea) {
        textarea.addEventListener('input', () => {
            customStyle.textContent = textarea.value;
        });
    }

    const dropdownHeader = document.querySelector('.dropdown-header');
    const dropdownList = document.querySelector('.dropdown-list');
    const selectedTheme = document.getElementById('selected-theme');
    const THEME_KEY = 'userTheme';

    dropdownHeader.addEventListener('click', () => {
        dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
    });

    dropdownList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const theme = event.target.getAttribute('data-theme');
            document.body.className = theme;
            selectedTheme.textContent = event.target.textContent;
            localStorage.setItem(THEME_KEY, theme);
        }
    });

    if (saveChangesButton) {
        saveChangesButton.addEventListener("click", () => {
            if (textarea) {
                localStorage.setItem('customCSS', textarea.value);
            }
            localStorage.setItem('userTheme', document.body.className);
            const adSwitch = document.getElementById('adToggle');
            if (adSwitch) {
                localStorage.setItem('disableAds', adSwitch.checked);
            }
            alert("Settings Saved!");
        });
    }

    loadCustomCSS();
    loadTheme();
    loadAdSetting();

    // Disable Ads Functionality
    function toggleAds(disabled) {
        const adElement = document.getElementById('abscent2');
        if (adElement) {
            adElement.style.display = disabled ? 'none' : 'block';
        }
    }

    function loadAdSetting() {
        const adsDisabled = localStorage.getItem('disableAds') === 'true';
        toggleAds(adsDisabled);

        const adSwitch = document.getElementById('adToggle');
        if (adSwitch) {
            adSwitch.checked = adsDisabled;
            adSwitch.addEventListener('change', () => {
                localStorage.setItem('disableAds', adSwitch.checked);
                toggleAds(adSwitch.checked);
            });
        }
    }

    function loadCustomCSS() {
        const savedCSS = localStorage.getItem('customCSS');
        if (savedCSS && textarea) {
            customStyle.textContent = savedCSS;
            textarea.value = savedCSS;
        }
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) {
            document.body.className = savedTheme;
            const selectedElement = document.querySelector(`[data-theme="${savedTheme}"]`);
            if (selectedElement) {
                selectedTheme.textContent = selectedElement.textContent; 
            }
        }
    }
});
