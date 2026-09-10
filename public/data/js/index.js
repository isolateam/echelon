"use strict";

const form = document.getElementById("uv-form");
const address = document.getElementById("uv-address");
const searchEngine = document.getElementById("uv-search-engine");

let controller = null;

async function initScramjet() {
    await navigator.serviceWorker.register("/sw.js", { scope: "/" });

    if (!navigator.serviceWorker.controller) {
        await new Promise(resolve => {
            navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true });
        });
    }

    const serviceworker = navigator.serviceWorker.controller;

    const wispUrl = `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/wisp/`;

    const { default: EpoxyClient } = await import("/epoxy/index.mjs");
    const transport = new EpoxyClient({ wisp: wispUrl });

    controller = new $scramjetController.Controller({
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

function launch(val) {
    if (!val) return;

    const url = search(val);

    sessionStorage.setItem("encodedUrl", url);
    location.href = `/null?url=${encodeURIComponent(url)}`;
}

form?.addEventListener("submit", event => {
    event.preventDefault();
    launch(address.value);
});

initScramjet().catch(console.error);