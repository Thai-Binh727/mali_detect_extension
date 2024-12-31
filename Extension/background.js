// Maintain a list of whitelisted domains
const whitelist = new Set();

// Helper function to extract the domain from a URL
function getDomainFromUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname; // Returns domain (e.g., youtube.com)
    } catch (error) {
        console.error("Invalid URL:", url, error);
        return null;
    }
}

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkUrl") {
        const url = message.url;
        const domain = getDomainFromUrl(url);

        if (!domain) {
            sendResponse({ isMalicious: false });
            return;
        }

        // Use your logic to determine if the URL is malicious
        fetch("http://192.168.119.140:5000/check-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
        })
            .then((response) => response.json())
            .then((data) => {
                const isMalicious = data.isMalicious;
                sendResponse({ isMalicious });
            })
            .catch((error) => {
                console.error("Error checking URL:", error);
                sendResponse({ isMalicious: false });
            });

        return true; // Keep the message channel open for asynchronous response
    } else if (message.action === "setWhitelisted") {
        // Add the domain to the whitelist
        const domain = getDomainFromUrl(message.url);
        if (domain) {
            console.log("Whitelisting domain:", domain);
            whitelist.add(domain);
            sendResponse(true);
        } else {
            sendResponse(false);
        }
    } else if (message.action === "isWhitelisted") {
        // Check if the domain is in the whitelist
        const domain = getDomainFromUrl(message.url);
        const isWhitelisted = domain && whitelist.has(domain);
        console.log("Checking whitelist for domain:", domain, "->", isWhitelisted);
        sendResponse(isWhitelisted);
    }
});