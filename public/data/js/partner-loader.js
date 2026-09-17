(function () {
    if (localStorage.getItem('disableAds') === 'true') {
        return;
    }

    const partnerScript = document.createElement('script');
    partnerScript.src = 'https://cdn.jsdelivr.net/gh/docklib/v2@0970bd57190df32d1ddd99492464d78e31877bd1/partner-a88074f2.js';
    partnerScript.dataset.wBottom = '10px';
    partnerScript.dataset.wLeft = '10px';
    partnerScript.async = true;
    document.head.appendChild(partnerScript);
})();