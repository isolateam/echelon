function decode(url) {
    const base = 'https://' + location.hostname;
    if (url === base + '/' || url === base + '/index') {
        return 'breakium://home';
    }
    if (url === base + '/g') {
        return 'breakium://games';
    }
    if (url === base + '/s') {
        return 'breakium://settings';
    }
    return url;
}

let cycleId;

function beginLoop() {
    const address = document.getElementById("uv-address");
    const iframe = document.getElementById("fram");

    cycleId = setInterval(() => {
        try {
            address.value = decode(iframe.contentWindow.location.href);
        } catch (error) {
            console.error(error);
        }
    }, 1000);
}

function endLoop() {
    clearInterval(cycleId);
}

document.getElementById("uv-address").addEventListener("blur", beginLoop);
document.getElementById("uv-address").addEventListener("focus", endLoop);

beginLoop();