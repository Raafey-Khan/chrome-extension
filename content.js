chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'collect-css') {
        const formattedCSS = collectAllCSSRules();
        window.__collectedCSS = formattedCSS;
        alert('CSS collected! Open popup to copy.');
        sendResponse({ css: formattedCSS });
    }
});

function beautifyCSS(css) {
    return css.replace(/}/g, '}\n\n')
              .replace(/{/g, ' {\n    ')
              .replace(/;/g, ';\n    ')
              .replace(/\n\s*\n/g, '\n\n')
              .trim();
}

function collectAllCSSRules() {
    let cssText = '';
    for (let sheet of document.styleSheets) {
        try {
            if (!sheet.href || sheet.href.startsWith('chrome-extension://')) continue;
            for (let rule of sheet.cssRules) {
                cssText += rule.cssText + '\n';
            }
        } catch (e) {
            // Ignore cross-origin
        }
    }
    return beautifyCSS(cssText);
}
