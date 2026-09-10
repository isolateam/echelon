fetch('/data/json/games.json')
  .then(response => response.json())
  .then(data => {
    const gameContainer = document.body;

    data.games.forEach(game => {
      const div = document.createElement('div');
      div.className = 'bubbly-div';

      const img = document.createElement('img');
      img.src = game.image;

      const link = document.createElement('a');
      link.textContent = game.name;
      link.href = '#';
      link.style.cursor = 'pointer';

      if (game.directory.includes('data/g')) {
        link.href = game.directory;
      } else {
        link.onclick = event => {
          event.preventDefault();
          launch(game.directory);
        };
      }

      div.onclick = () => link.click();

      div.appendChild(img);
      div.appendChild(link);
      gameContainer.appendChild(div);
    });
  })
  .catch(error => console.error('Error loading games:', error));

function launch(url) {
  sessionStorage.setItem('gameUrl', url);
  window.location.href = '/null';
}