// Import the necessary modules and APIs
const openai = require('openai');
openai.apiKey = process.env.OPENAI_API_KEY;

// Initialize an empty array to store the user's goals
let goals = [];

// Function to set a new goal
const setGoal = async (prompt) => {
    try {
        // Use the OpenAI API to generate a goal based on the user's prompt
        const response = await openai.Completion.create({
            engine: "text-davinci-002",
            prompt: prompt,
            max_tokens: 100,
            temperature: 0.5
        });

        // Extract the goal from the API response
        const goal = response.choices[0].text;

        // Add the goal to the goals array
        goals.push(goal);

        // Save the goals array to the browser's storage
        chrome.storage.local.set({'goals': goals}, function() {
            console.log('Goals saved to storage');
        });

        // Return the goal to the user
        return goal;
    } catch (error) {
        console.log(error);
    }
};

// Function to retrieve the user's goals from storage
const getGoals = () => {
    chrome.storage.local.get(['goals'], function(result) {
        // Update the goals array with the goals from storage
        goals = result.goals;

        // Display the goals in the UI
        displayGoals();
    });
};

// Function to display the goals in the UI
const displayGoals = () => {
    // Clear the previous goals from the UI
    document.getElementById("goals").innerHTML = "";

    // Loop through the goals array and add each goal to the UI
    for (let i = 0; i < goals.length; i++) {
        let goal = goals[i];
        let goalDiv = document.createElement("div");
        goalDiv.innerHTML = goal;
        document.getElementById("goals").appendChild(goalDiv);
    }
};

// Function to track progress on the goals
const trackProgress = () => {
    // Use the OpenAI API to generate progress updates for each goal
    for (let i = 0; i < goals.length; i++) {
        let goal = goals[i];
        openai.Completion.create({
            engine: "text-davinci-002",
            prompt: `provide an update on my progress with the goal: ${goal}`,
            max_tokens: 100,
            temperature: 0.5
        }).then(response => {
            let progress = response.choices[0].text;
            // Display the progress in the UI
            displayProgress(goal, progress);
        }).catch(console.error);
    }
};

// Function to display progress in the UI
const displayProgress = (goal, progress) => {
    let progressDiv = document.createElement("div");
    progressDiv.innerHTML = `${goal}: ${progress}`;
    document.getElementById("progress").appendChild(progressDiv);
};

// Add event listener for the "Save Goal" button
document.getElementById("save_goal_button").addEventListener("click", () => {
// Get the goal from the input field
let goal = document.getElementById("goal_input").value;
// Use the OpenAI API to track the goal
fetch("https://api.openai.com/v1/engines/davinci/completions", {
headers: {
"Content-Type": "application/json",
"Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
  },
method: "POST",
body: JSON.stringify({
prompt: `track progress on goal: ${goal}`,
max_tokens: 100,
temperature: 0.5
})
})
.then(response => response.json())
.then(data => {
let progress = data.choices[0].text;
// Save the goal and progress to chrome storage
chrome.storage.sync.set({[goal]: progress}, () => {
console.log(`Saved goal: ${goal} with progress: ${progress}`);
  });
// Display the progress in the UI
displayProgress(goal, progress);
});
});

// Get the stored goals and progress from chrome storage on page load
document.addEventListener("DOMContentLoaded", () => {
chrome.storage.sync.get(null, (data) => {
for (let goal in data) {
displayProgress(goal, data[goal]);
}
});
});

// Add a function to clear the goals from storage and the UI
const clearGoals = () => {
chrome.storage.sync.clear(() => {
console.log("Cleared goals from storage.");
});
document.getElementById("progress").innerHTML = "";
};

// Add event listener for the "Clear Goals" button
document.getElementById("clear_goals_button").addEventListener("click", clearGoals);
}
});
}
});
}
});
