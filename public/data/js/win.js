const form = document.getElementById("uv-form");
const address = document.getElementById("uv-address");
const fram = document.getElementById("fram");

let sjFrame;

function launch(url) {
    if (!url) return;

    if (sjFrame) {
        sjFrame.go(url);
    } else {
        console.error("Scramjet is not initialized");
    }
}

function rFram() {
  if (sjFrame) sjFrame.go(sjFrame.url);
}

function bFram() {
  fram.contentWindow.history.back();
}

function fFram() {
  fram.contentWindow.history.forward();
}

function oFram() {
  if (!fram.src || fram.src === location.origin + "/null" || fram.src === "/null") {
    error("nope");
  } else {
    window.open(fram.src, "_blank");
  }
}

var elem = document.documentElement;
var isFullscreen = false;

function fsFram() {
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  isFullscreen = true;
}

function cfsFram() {
  if (document.exitFullscreen) document.exitFullscreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  else if (document.msExitFullscreen) document.msExitFullscreen();
  isFullscreen = false;
}

function tfsFram() {
  if (isFullscreen) cfsFram();
  else fsFram();
}

setTimeout(() => {
  if (typeof eruda !== "undefined") eruda.destroy();
}, 30);

function ntFram() {
  window.open(fram.src);
}

function search(input) {
  input = input.trim();

  const searchTemplate =
    localStorage.getItem("engine") || "https://google.com/search?q=%s";

  try {
    return new URL(input).toString();
  } catch {
    try {
      const url = new URL(`http://${input}`);

      if (url.hostname.includes(".")) {
        return url.toString();
      }

      throw new Error();
    } catch {
      return searchTemplate.replace("%s", encodeURIComponent(input));
    }
  }
}

async function initScramjet() {
  await navigator.serviceWorker.register("/sw.js", {
    scope: "/"
  });

  if (!navigator.serviceWorker.controller) {
    await new Promise(resolve => {
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        resolve,
        { once: true }
      );
    });
  }

  const serviceworker = navigator.serviceWorker.controller;

  const wispUrl =
    `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/wisp/`;

  const { default: EpoxyClient } =
    await import("/epoxy/index.mjs");

  const transport = new EpoxyClient({
    wisp: wispUrl
  });

  const controller = new $scramjetController.Controller({
    serviceworker,
    transport,
    config: {
      prefix: "/~/sj/",
      scramjetPath: "/scram/scramjet.js",
      wasmPath: "/scram/scramjet.wasm",
      injectPath: "/controller/controller.inject.js"
    }
  });

  await controller.wait();

  sjFrame = controller.createFrame(fram);

  form.addEventListener("submit", event => {
    event.preventDefault();

    const url = search(address.value);

    if (!url) return;

    sjFrame.go(url);
  });
}

initScramjet().catch(console.error);