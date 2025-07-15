document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => window.__collectedCSS || ''
        }, (results) => {
            document.getElementById('css-output').value = results[0].result || '';
        });
    });

    document.getElementById('start-btn').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'collect-css' }, (response) => {
                document.getElementById('css-output').value = response?.css || '';
            });
        });
    });

    document.getElementById('copy-btn').addEventListener('click', () => {
        const cssText = document.getElementById('css-output').value;
        navigator.clipboard.writeText(cssText).then(() => {
            alert('CSS copied to clipboard!');
        });
    });
});
