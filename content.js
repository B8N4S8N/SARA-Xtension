// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// Check if the message is to fill out the form
if (request.type === "fill_out_form") {
// Get all the form inputs
let inputs = document.querySelectorAll("input, select, textarea");
// Loop through the inputs and fill them out with the user's information
for (let i = 0; i < inputs.length; i++) {
let input = inputs[i];
if (input.name === "name") {
input.value = request.name;
} else if (input.name === "email") {
input.value = request.email;
} else if (input.name === "gender") {
input.value = request.gender;
} else if (input.name === "race") {
input.value = request.race;
} else if (input.name === "veteran") {
input.value = request.veteran;
}
}
}
// Check if the message is to display support groups
if (request.type === "support_groups") {
let supportGroups = request.data;
// Display the support groups on the page
// Create a new div to hold the support groups
let supportGroupsDiv = document.createElement("div");
supportGroupsDiv.innerHTML = supportGroups;
// Add the div to the page
document.body.appendChild(supportGroupsDiv);
}
// Check if the message is to display treatment centers
if (request.type === "treatment_centers") {
let treatmentCenters = request.data;
// Display the treatment centers on the page
// Create a new div to hold the treatment centers
let treatmentCentersDiv = document.createElement("div");
treatmentCentersDiv.innerHTML = treatmentCenters;
// Add the div to the page
document.body.appendChild(treatmentCentersDiv);
}
});

// Listen for clicks on the "Find Treatment Centers" button
document.getElementById("find_treatment_centers_button").addEventListener("click", () => {
// Send message to background script to get user's location
chrome.runtime.sendMessage({ type: "get_user_location" }, (response) => {
let zipcode = response.zipcode;
// Use the OpenAI API to find treatment centers in the user's area
fetch("https://api.openai.com/v1/engines/davinci/completions", {
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`},
  method: "POST",
body: JSON.stringify({
prompt:`find treatment centers in ${zipcode}`,
  max_tokens: 100,
temperature: 0.5
})
})
.then(response => response.json())
.then(data => {
let treatmentCenters = data.choices[0].text;
// Send the treatment centers to the background script
chrome.runtime.sendMessage({ type: "treatment_centers", data: treatmentCenters }, (response) => {
let locations = response.locations;
// Show the locations on the map
showLocationsOnMap(locations);
});
});
});
});

// Listen for clicks on the "Find Support Groups" button
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

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// If the message is to show treatment centers on a map
if (request.type === "show_treatment_centers_on_map") {
// Show the locations on a map
showLocationsOnMap(request.data);
}
// If the message is to show support groups on a map
else if (request.type === "show_support_groups_on_map") {
// Show the locations on a map
showLocationsOnMap(request.data);
}
});
});

// Function to show locations on a map
function showLocationsOnMap(locations) {
// Create a new map
let map = new google.maps.Map(document.getElementById('map'), {
zoom: 10,
center: new google.maps.LatLng(locations[0].geometry.location.lat, locations[0].geometry.location.lng),
mapTypeId: google.maps.MapTypeId.ROADMAP
});
// Add markers for each location
for (let i = 0; i < locations.length; i++) {
let location = locations[i];
let marker = new google.maps.Marker({
position: new google.maps.LatLng(location.geometry.location.lat, location.geometry.location.lng),
map: map,
title: location.name
});
}
}
});
}
});
}
});
}
});
}
});
}
});
}
});
}
});
}
});
}
});
}
});
}
});
}
});
}
