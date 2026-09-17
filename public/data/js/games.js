let gamesContainer;

function sortGames(sortBy = 'added') {
    if (!gamesContainer) return;

    const games = Array.from(gamesContainer.children);
    games.sort((a, b) => {
        if (sortBy === 'alphabetical') {
            return a.querySelector('a').textContent.localeCompare(
                b.querySelector('a').textContent,
                undefined,
                { sensitivity: 'base' }
            );
        }

        const dateA = a.dataset.addedDate ? Date.parse(a.dataset.addedDate) : NaN;
        const dateB = b.dataset.addedDate ? Date.parse(b.dataset.addedDate) : NaN;

        if (!Number.isNaN(dateA) && !Number.isNaN(dateB)) {
            return dateB - dateA;
        }

        return Number(a.dataset.addedOrder) - Number(b.dataset.addedOrder);
    });

    games.forEach(game => gamesContainer.appendChild(game));
}

window.sortGames = sortGames;

fetch('/data/json/games.json')
    .then(response => response.json())
    .then(data => {
        gamesContainer = document.getElementById('gamesGrid');

        data.games.forEach((game, index) => {
            const d = document.createElement('div');
            d.className = 'bubbly-div';
            d.dataset.addedOrder = index;
            if (game.added || game.addedDate) {
                d.dataset.addedDate = game.added || game.addedDate;
            }

            const i = document.createElement('img');
            i.src = game.image;

            const a = document.createElement('a');
            a.textContent = game.name;
            a.href = '#';
            a.style.cursor = 'pointer';

            a.onclick = e => {
                e.preventDefault();
                e.stopPropagation();
                launch(game.directory);
            };

            d.onclick = e => {
                if (e.target !== a) launch(game.directory);
            };

            d.append(i, a);
            gamesContainer.appendChild(d);
        });

        sortGames(document.getElementById('gameSort')?.value || 'added');
    })
    .catch(e => console.error('error loading games:', e));