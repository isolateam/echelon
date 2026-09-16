function decode(url) {
    const base = location.origin;
    if (url === base + '/' || url === base + '/index')
        return 'breakium://home';
    if (url === base + '/g')
        return 'breakium://games';
    if (url === base + '/s')
        return 'breakium://settings';
    const m = url.match(/\/~\/sj\/[^/]+\/[^/]+\/(https?%3A.*?)(?:\?|$)/);
    if (m) {
        try {
            return decodeURIComponent(m[1]);
        } catch {}
    }
    return url;
}

const address = document.getElementById("uv-address");

function updateAddress(iframe) {
    try {
        if (address && iframe?.contentWindow) {
            address.value = decode(iframe.contentWindow.location.href);
        }
    } catch {
        // The iframe may be between navigations.
    }
}

function bindNavigationFrame(iframe) {
    if (!iframe || iframe.dataset.urlUpdaterBound) return;
    iframe.dataset.urlUpdaterBound = "true";
    iframe.addEventListener("load", () => updateAddress(iframe));
    updateAddress(iframe);
}

function bindActiveTab() {
    const directFrame = document.getElementById("fram");
    if (directFrame) {
        bindNavigationFrame(directFrame);
        return;
    }

    const activeTab = document.querySelector("iframe.active-iframe");
    const navigationFrame = activeTab?.contentDocument?.getElementById("fram");
    bindNavigationFrame(navigationFrame);
}

window.addEventListener("active-tab-changed", bindActiveTab);

function bindTab(tab) {
    if (!tab || tab.dataset.urlUpdaterBound) return;
    tab.dataset.urlUpdaterBound = "true";
    tab.addEventListener("load", bindActiveTab);
}

document.querySelectorAll("iframe").forEach(bindTab);
bindActiveTab();

const observer = new MutationObserver(() => {
    document.querySelectorAll("iframe").forEach(bindTab);
    bindActiveTab();
});
observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });