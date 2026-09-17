
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
  .then(r => r.json())
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

async function launch(url) {
  const old = document.getElementById("game-overlay");
  if (old) old.remove();

  const targetUrl = new URL(url, window.location.href);

  const o = document.createElement("div");
  o.id = "game-overlay";

  const m = document.createElement("div");
  m.id = "game-modal";

  const f = document.createElement("iframe");
  f.style.cssText = "width:100%;height:100%;border:0";

  const fs = document.createElement("button");
  fs.textContent = "⛶";
  fs.id = "game-fullscreen";

  const c = document.createElement("button");
  c.textContent = "X";
  c.id = "game-close";

  fs.onclick = e => {
    e.stopPropagation();
    document.fullscreenElement ? document.exitFullscreen() : m.requestFullscreen();
  };

  c.onclick = e => {
    e.stopPropagation();
    o.remove();
  };

  m.append(f, fs, c);
  o.appendChild(m);
  document.body.appendChild(o);

  if (targetUrl.origin === window.location.origin) {
    f.src = targetUrl.href;
    requestAnimationFrame(() => o.classList.add("show"));
    return;
  }

  const sw = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  if (!navigator.serviceWorker.controller)
    await new Promise(r => navigator.serviceWorker.addEventListener("controllerchange", r, { once: true }));

  const { default: EpoxyClient } = await import("/epoxy/index.mjs");
  const wisp = `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/wisp/`;
  const transport = new EpoxyClient({ wisp });

  const controller = new $scramjetController.Controller({
    serviceworker: navigator.serviceWorker.controller,
    transport,
    config: {
      prefix: "/~/sj/",
      scramjetPath: "/scram/scramjet.js",
      wasmPath: "/scram/scramjet.wasm",
      injectPath: "/controller/controller.inject.js"
    }
  });

  await controller.wait();

  const sj = controller.createFrame(f);
  sj.go(targetUrl.href);

  requestAnimationFrame(() => o.classList.add("show"));
}

