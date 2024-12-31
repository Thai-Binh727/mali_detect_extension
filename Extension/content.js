console.log("Content script running on:", window.location.href);
const logoPath = chrome.runtime.getURL("logo.png");


chrome.runtime.sendMessage(
    { action: "checkUrl", url: window.location.href },
    (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error communicating with the background script:", chrome.runtime.lastError);
            return;
        }

        if (response?.isMalicious) {
            chrome.runtime.sendMessage(
                { action: "isWhitelisted", url: window.location.href },
                (isWhitelisted) => {
                    if (isWhitelisted) {
                        console.log("User chose to proceed. Allowing access to:", window.location.href);
                        return;
                    }

                    // Clear the existing page content
                    document.body.innerHTML = "";
                    document.head.innerHTML = "";

                    // Inject the custom warning page
                    document.body.innerHTML = `
                        <style>
                            body {
                                background-color: #3f51b5;
                                color: white;
                                font-family: Arial, sans-serif;
                                text-align: center;
                                margin: 0;
                                padding: 0;
                                height: 100vh;
                                display: flex;
                                flex-direction: column;
                                justify-content: flex-start;
                                align-items: center;
                            }
                            .logo {
                                margin-top: 20vh;
                                width: 20%;
                                height: auto;
                            }
                            .message {
                                margin-top: 20px;
                                max-width: 900px;
                                font-size: 24px;
                                font-weight: bold;
                                line-height: 1.5;
                            }
                            .proceed-button {
                                background-color: white;
                                color: red;
                                border: none;
                                padding: 10px 20px;
                                font-size: 16px;
                                font-weight: bold;
                                cursor: pointer;
                                border-radius: 5px;
                                transition: background-color 0.3s, color 0.3s;
                                margin-top: 20px;
                            }
                            .proceed-button:hover {
                                background-color: darkred;
                                color: white;
                            }
                        </style>
                        <img src="${logoPath}" alt="Logo" class="logo">
                        <div class="message">
                            The page you are trying to access is flagged as malicious by USTH URL Checker service. 
                            Proceeding to access the website might install dangerous programs on your computer 
                            to compromise your system or steal your data.
                        </div>
                        <button class="proceed-button" id="proceedButton">Proceed</button>
                    `;

                    // Handle the "Proceed" button logic
                    document.getElementById("proceedButton").addEventListener("click", () => {
                        console.log("User chose to proceed.");
                        chrome.runtime.sendMessage({ action: "setWhitelisted", url: window.location.href });
                        location.reload(); // Reload the page to allow access
                    });
                }
            );
        } else {
            console.log("Safe site:", window.location.href);
        }
    }
);
