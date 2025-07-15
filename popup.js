document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.cssCollected) {
            document.getElementById('css-output').value = msg.css || '';
        }
    });

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
        chrome.scripting.insertCSS({
            target: { tabId: tabs[0].id },
            files: ['styles.css']
        });
        chrome.tabs.sendMessage(tabs[0].id, { action: 'start-picker' });
    });
});


    document.getElementById('copy-btn').addEventListener('click', () => {
        const cssText = document.getElementById('css-output').value;
        navigator.clipboard.writeText(cssText).then(() => {
            alert('CSS copied to clipboard!');
        });
    });
});
