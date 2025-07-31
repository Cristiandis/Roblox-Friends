function walkAndReplace(node) {
    const replacements = {
        "Connections": "Friends",
        "Connect": "Friends"
    };

    const isTextNode = node.nodeType === Node.TEXT_NODE;

    if (isTextNode) {
        for (const [key, value] of Object.entries(replacements)) {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            if (regex.test(node.nodeValue)) {
                node.nodeValue = node.nodeValue.replace(regex, (match) => {
                    if (match === match.toUpperCase()) return value.toUpperCase();
                    if (match[0] === match[0].toUpperCase()) return value[0].toUpperCase() + value.slice(1);
                    return value.toLowerCase();
                });
            }
        }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
        for (let child of node.childNodes) {
            walkAndReplace(child);
        }
    }
}

function runReplacements() {
    walkAndReplace(document.body);
}

const observer = new MutationObserver(() => {
    runReplacements();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
    /* Center the text under the icon */
    #friend-tile-button {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px;
    }

    .friends-carousel-tile-labels {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    .friends-carousel-tile-name {
        text-align: center !important;
        font-size: 13px !important;
        line-height: 1 !important;
        margin-top: 4px !important;
        display: block !important;
    }

    .friends-carousel-display-name {
        display: inline-block !important;
        transform: translateY(0px) !important;
        font-weight: 400 !important;
    }
    `;
    document.head.appendChild(style);
}

injectCSS();
runReplacements();
