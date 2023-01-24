// Get the current tab's URL
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentUrl = tabs[0].url;
    // Get the text on the page
    let pageText = document.body.innerText;
    // Use OpenAI API to summarize the text
    fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: `summarize this text: ${pageText}`,
            max_tokens: 100,
            temperature: 0.5
        })
    })
        .then(response => response.json())
        .then(data => {
            let summary = data.choices[0].text;
            // Display the summary to the user
            let summaryBox = document.createElement("div");
            summaryBox.innerHTML = summary;
            document.body.appendChild(summaryBox);
        });
    // Use OpenAI API to understand the user's identity, gender, race, veteran status, etc. and fill out forms on the page accordingly
    fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: `analyze this text: ${pageText}`,
            max_tokens: 100,
            temperature: 0.5
        })
    })
        .then(response => response.json())
        .then(data => {
            let userInfo = data.choices[0].text;
            // Use the user's information to fill out forms on the page
            let inputs = document.querySelectorAll("input[type='text']");
            inputs.forEach(input => {
                if (input.name === "name") {
                    input.value = userInfo.name;
                } else if (input.name === "gender") {
                    input.value = userInfo.gender;
                }
                // Add more conditions for other fields as needed
            });
        });
});
