// Add the Google Maps API
const script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key="+process.env.GOOGLE_MAPS_API_KEY;
script.defer = true;
script.async = true;
document.head.appendChild(script);

// Handle messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "summary") {
        // Use OpenAI API to summarize the text on the page
        fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: `summarize ${request.text}`,
                max_tokens: 100,
                temperature: 0.5
            })
        })
            .then(response => response.json())
            .then(data => {
                let summary = data.choices[0].text;
                // Send the summary back to the content script
                sendResponse({ summary });
            });
        return true;
    } else if (request.type === "form_injection") {
        // Use OpenAI API to understand the user's identity and automatically fill out forms on the page
        fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: `fill out forms with identity: ${request.identity}`,
                max_tokens: 100,
                temperature: 0.5
            })
        })
            .then(response => response.json())
            .then(data => {
                let formData = data.choices[0].text;
                // Send the form data back to the content script
                sendResponse({ formData });
            });
        return true;
    } else if (request.type === "support_groups") {
        // Use OpenAI API to find support groups in the user's area
        fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: `find support groups in ${request.zipcode}`,
                max_tokens: 100,
                temperature: 0.5
            })
        })
            .then(response => response.json())
.then(data => {
let supportGroups = data.choices[0].text;
// Send the support groups back to the content script
sendResponse({ supportGroups });
})
.catch(error => {
console.log(error);
sendResponse({ error });
});
return true;
}
});
});

// Add event listener for the "Find Support Groups" button
document.getElementById("find_support_groups_button").addEventListener("click", () => {
// Get the zipcode from the input field
let zipcode = document.getElementById("zipcode_input").value;
// Send a message to the background script with the zipcode
chrome.runtime.sendMessage({ type: "find_support_groups", zipcode });
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
if (request.type === "found_support_groups") {
// Display the support groups on the page
document.getElementById("support_groups_list").innerHTML = request.supportGroups;
}
});

// Add event listener for the "Find Treatment Centers" button
document.getElementById("find_treatment_centers_button").addEventListener("click", () => {
// Get the zipcode from the input field
let zipcode = document.getElementById("zipcode_input").value;
// Send a message to the background script with the zipcode
chrome.runtime.sendMessage({ type: "find_treatment_centers", zipcode });
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
if (request.type === "found_treatment_centers") {
// Display the treatment centers on the page
document.getElementById("treatment_centers_list").innerHTML = request.treatmentCenters;
}
});

// Add event listener for the "Track Goals" button
document.getElementById("track_goals_button").addEventListener("click", () => {
// Get the goal from the input field
let goal = document.getElementById("goal_input").value;
// Send a message to the background script with the goal
chrome.runtime.sendMessage({ type: "track_goal", goal });
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
if (request.type === "tracked_goal") {
// Display the tracked goal on the page
document.getElementById("tracked_goals_list").innerHTML = request.goal;
}
});

// Add event listener for the "Chatbot" button
document.getElementById("chatbot_button").addEventListener("click", () => {
// Get the question from the input field
let question = document.getElementById("question_input").value;
// Send a message to the background script with the question
chrome.runtime.sendMessage({ type: "chatbot", question });
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// Check if the message is for the support group search
if (request.type === "support_group_search") {
// Use the OpenAI API to search for support groups in the provided zip code
fetch("https://api.openai.com/v1/engines/davinci/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": Bearer ${process.env.OPENAI_API_KEY}
},
body: JSON.stringify({
prompt: find support groups in ${request.zipcode},
max_tokens: 100,
temperature: 0.5
})
})
.then(response => response.json())
.then(data => {
let supportGroups = data.choices[0].text;
// Send the support groups back to the content script
sendResponse({
supportGroups: supportGroups
});
})
.catch(error => {
console.error(error);
});
}
return true;
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// Check if the message is for the support group search
if (request.type === "support_group_search") {
// Send the support groups to the content script
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
chrome.tabs.sendMessage(tabs[0].id, { supportGroups: request.supportGroups });
});
}
return true;
});
}
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// Check if the message is for the treatment center search
if (request.type === "treatment_center_search") {
// Send the treatment centers to the content script
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
chrome.tabs.sendMessage(tabs[0].id, { treatmentCenters: request.treatmentCenters });
});
}
return true;
});

}
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// Check if the message is for the summary
if (request.type === "summary") {
// Use the OpenAI API to summarize the provided text
fetch("https://api.openai.com/v1/engines/davinci/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": Bearer ${process.env.OPENAI_API_KEY}
},
body: JSON.stringify({
prompt: summarize ${request.text},
max_tokens: 100,
temperature: 0.5
})
})
.then(response => response.json())
.then(data => {let summary = data.choices[0].text;
// Display the summary on the page
let summaryDiv = document.createElement("div");
summaryDiv.innerText = summary;
document.body.appendChild(summaryDiv);
});
});

// Add event listener for the "Fill Form" button
document.getElementById("fill_form_button").addEventListener("click", () => {
// Send message to background script to get user's identity information
chrome.runtime.sendMessage({ type: "get_user_identity" }, (response) => {
// Use the OpenAI API to fill the form on the page with the user's identity information
let form = document.querySelector("form");
form.querySelector("#name").value = response.name;
form.querySelector("#gender").value = response.gender;
form.querySelector("#race").value = response.race;
form.querySelector("#veteran_status").value = response.veteran_status;
// Send message to background script to save the user's identity information
chrome.runtime.sendMessage({ type: "save_user_identity", identity: response });
});
});

// Add event listener for the "Find Support Groups" button
document.getElementById("find_support_groups_button").addEventListener("click", () => {
// Send message to background script to get user's location
chrome.runtime.sendMessage({ type: "get_user_location" }, (response) => {
let zipcode = response.zipcode;
// Use the OpenAI API to find support groups in the user's area
fetch("https://api.openai.com/v1/engines/davinci/completions", {
headers: {
"Content-Type": "application/json",
"Authorization": Bearer ${process.env.OPENAI_API_KEY}
},
method: "POST",
body: JSON.stringify({
prompt: find support groups in ${zipcode},
max_tokens: 100,
temperature: 0.5
})
})
.then(response => response.json())
.then(data => {
let supportGroups = data.choices[0].text;
// Display the support groups on the page
let supportGroupsDiv = document.createElement("div");
supportGroupsDiv.innerText = supportGroups;
document.body.appendChild(supportGroupsDiv);
});
});
});

// Add event listener for the "Find Treatment Centers" button
document.getElementById("find_treatment_centers_button").addEventListener("click", () => {
// Send message to background script to get user's location
chrome.runtime.sendMessage({ type: "get_user_location" }, (response) => {
let zipcode = response.zipcode;
// Use the OpenAI API to find treatment centers in the user's area
fetch("https://api.openai.com/v1/engines/davinci/completions", {
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.// Add event listener for the "Find Treatment Centers" button
document.getElementById("find_treatment_centers_button").addEventListener("click", () => {
// Send message to background script to get user's location
chrome.runtime.sendMessage({ type: "get_user_location" }, (response) => {
let zipcode = response.zipcode;
// Use the OpenAI API to find treatment centers in the user's area
fetch("https://api.openai.com/v1/engines/davinci/completions", {
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.// Add event listener for the "Find Treatment Centers" button
document.getElementById("find_treatment_centers_button").addEventListener("click", () => {
// Send message to background script to get user's location
chrome.runtime.sendMessage({ type: "get_user_location" }, (response) => {
let zipcode = response.zipcode;
// Use the OpenAI API to find treatment centers in the user's area
fetch("https://api.openai.com/v1/engines/davinci/completions", {
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`}, method: "POST", body: JSON.stringify({ prompt:`find treatment centers in ${zipcode}`,
max_tokens: 100,
temperature: 0.5
})
})
.then(response => response.json())
.then(data => {
let treatmentCenters = data.choices[0].text;
// Send the treatment centers back to the content script
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
chrome.tabs.sendMessage(tabs[0].id, { type: "treatment_centers", data: treatmentCenters });
});
});
});

// Add event listener for the "Find Support Groups" button
document.getElementById("find_support_groups_button").addEventListener("click", () => {
// Send message to background script to get user's location
chrome.runtime.sendMessage({ type: "get_user_location" }, (response) => {
let zipcode = response.zipcode;
// Use the OpenAI API to find support groups in the user's area
fetch("https://api.openai.com/v1/engines/davinci/completions", {
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`},
method: "POST",
body: JSON.stringify({
prompt: `find support groups in ${zipcode}`, 
max_tokens: 100,
temperature: 0.5
})
})
.then(response => response.json())
.then(data => {
let supportGroups = data.choices[0].text;
// Send the support groups back to the content script
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
chrome.tabs.sendMessage(tabs[0].id, { type: "support_groups", data: supportGroups });
});
});
});
}
});



