// Check if the API key has been entered and saved
let apiKeyEntered = localStorage.getItem("apiKeyEntered");

if (apiKeyEntered === "true") {
    // If the API key has been entered and saved, hide the key input and show the "key entered" message
    document.getElementById("key_needed").style.display = "none";
    document.getElementById("key_entered").style.display = "block";
} else {
    // If the API key has not been entered and saved, hide the "key entered" message and show the key input
    document.getElementById("key_needed").style.display = "block";
    document.getElementById("key_entered").style.display = "none";
}

// Add event listener for the "Add key" button
document.getElementById("save_key_button").addEventListener("click", saveAPIKey);

// Add event listener for the "Change key" button
document.getElementById("change_key_button").addEventListener("click", changeAPIKey);

// Function to save the API key
function saveAPIKey() {
    // Get the value of the key input
    let apiKey = document.getElementById("key_input").value;

    // Save the key in local storage
    localStorage.setItem("apiKey", apiKey);

    // Save that the key has been entered and saved
    localStorage.setItem("apiKeyEntered", "true");

    // Hide the key input and show the "key entered" message
    document.getElementById("key_needed").style.display = "none";
    document.getElementById("key_entered").style.display = "block";
}

// Function to change the API key
function changeAPIKey() {
    // Remove the key from local storage
    localStorage.removeItem("apiKey");

    // Remove the "key entered" flag from local storage
    localStorage.removeItem("apiKeyEntered");

    // Show the key input and hide the "key entered" message
    document.getElementById("key_needed").style.display = "block";
    document.getElementById("key_entered").style.display = "none";
}

// Add any additional functionality here

// Add functionality for providing access to online peer support and resources for navigating recovery and mental health care
// Add functionality for finding support groups and treatment centers
// Add functionality for tools and trackers to help with goal setting and tracking progress on recovery goals
// Add functionality for providing access to contact the Open Source Recovery DAO for additional support and guidance
