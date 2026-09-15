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

      link.onclick = event => {
        event.preventDefault();
        event.stopPropagation();
        launch(game.directory);
      };

      div.onclick = event => {
        if (event.target === link) return;
        launch(game.directory);
      };

      div.appendChild(img);
      div.appendChild(link);
      gameContainer.appendChild(div);
    });
  })
  .catch(error => console.error('Error loading games:', error));

function launch(url) {
  sessionStorage.setItem('gameUrl', url);

  const oldOverlay = document.getElementById('game-overlay');
  if (oldOverlay) oldOverlay.remove();

  const overlay = document.createElement('div');
  overlay.id = 'game-overlay';

  const modal = document.createElement('div');
  modal.id = 'game-modal';

  const iframe = document.createElement('iframe');
  iframe.src = '/null';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0';

  const fullscreen = document.createElement('button');
  fullscreen.textContent = '⛶';
  fullscreen.id = 'game-fullscreen';

  const close = document.createElement('button');
  close.textContent = 'X';
  close.id = 'game-close';

  fullscreen.onclick = event => {
    event.stopPropagation();

    if (!document.fullscreenElement) {
      modal.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  close.onclick = event => {
    event.stopPropagation();
    overlay.remove();
    sessionStorage.removeItem('gameUrl');
  };

  modal.appendChild(iframe);
  modal.appendChild(fullscreen);
  modal.appendChild(close);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add('show');
  });
}