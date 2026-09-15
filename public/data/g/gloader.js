
fetch('/data/json/games.json')
  .then(r => r.json())
  .then(data => {
    const gc = document.body;
    data.games.forEach(game => {
      const d = document.createElement('div');
      d.className = 'bubbly-div';

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
      gc.appendChild(d);
    });
  })
  .catch(e => console.error('error loading games:', e));

async function launch(url) {
  const old = document.getElementById("game-overlay");
  if (old) old.remove();

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
  sj.go(url);

  requestAnimationFrame(() => o.classList.add("show"));
}

