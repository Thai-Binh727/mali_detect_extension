document.addEventListener("DOMContentLoaded", () => {
    const messageBox = document.getElementById("messageBox");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url; // Use the full URL instead of the hostname

        fetch("http://192.168.119.140:5000/check-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        })
        .then(response => response.json())
        .then(data => {
            const body = document.body;

            // Set the exact background color of the logo
            body.style.backgroundColor = "#3f51b5";

            if (data.isMalicious) {
                messageBox.textContent = "This site is flagged as malicious.";
            } else {
                messageBox.textContent = "This site is safe.";
            }
        })
        .catch(err => {
            console.error("Error contacting the server:", err);
            messageBox.textContent = "Unable to determine site status.";
        });
    });
});