chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'start-picker') {
        startElementPicker();
    }
});

function startElementPicker() {
    alert('Click any element to collect its authored CSS (not computed).');

    function onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        const element = event.target;
        const css = collectAuthoredCSS(element);
        window.__collectedCSS = css;
        document.removeEventListener('click', onClick, true);
        chrome.runtime.sendMessage({ cssCollected: true, css });
        navigator.clipboard.writeText(css);
        alert('Element authored CSS copied!');
    }

    document.addEventListener('click', onClick, true);
}

function collectAuthoredCSS(element) {
    let cssLines = [];

    for (let sheet of document.styleSheets) {
        try {
            if (!sheet.cssRules) continue;
            for (let rule of sheet.cssRules) {
                if (rule instanceof CSSStyleRule && element.matches(rule.selectorText)) {
                    const formatted = beautifyRule(rule);
                    cssLines.push(formatted);
                }
            }
        } catch (e) {
            // Ignore cross-origin stylesheets
        }
    }

    return cssLines.join('\n\n').trim();
}

function beautifyRule(rule) {
    const selector = rule.selectorText;
    const styleProps = Array.from(rule.style)
        .map(prop => `  ${prop}: ${rule.style.getPropertyValue(prop).trim()};`)
        .join('\n');

    return `${selector} {\n${styleProps}\n}`;
}
