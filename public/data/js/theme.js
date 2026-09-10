const THEME_KEY = 'userTheme';

function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem(THEME_KEY, theme);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        document.body.className = savedTheme;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSavedTheme();

    const themeItems = document.querySelectorAll('.dropdown-list li');
    themeItems.forEach(item => {
        item.addEventListener('click', () => {
            const theme = item.dataset.theme;
            applyTheme(theme);
            document.getElementById('selected-theme').textContent = item.textContent;
        });
    });
});
