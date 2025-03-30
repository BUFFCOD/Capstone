// Define the base URL for your local backend API
const API_BASE_URL = 'http://localhost:3000'; // Use the port your backend is running on

// Sync button functionality
document.querySelector('.sync-button')?.addEventListener('click', () => { // Added optional chaining just in case
    alert("Syncing data...");
    // Add actual sync logic here if needed
});

// Fetch Gemini API response dynamically
async function getGeminiResponse(prompt) {
    const chatResultDiv = document.getElementById('chatResult');
    if (!chatResultDiv) {
        console.error("Error: chatResult element not found in HTML.");
        return; // Exit if the target element doesn't exist
    }

    // Show a loading indicator (optional)
    chatResultDiv.innerHTML = `<p><i>Asking Gemini...</i></p>`;

    try {
        // Use the full URL to your backend endpoint
        const response = await fetch(`${API_BASE_URL}/api/gemini`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }), // Ensure the key is 'prompt' as expected by backend
        });

        // Check if the request was successful (status code 2xx)
        if (!response.ok) {
            // Try to parse error response from backend, otherwise use status text
            let errorMsg = `Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMsg = `Error: ${errorData.error || errorMsg}`; // Use backend error message if available
            } catch (e) {
                // Ignore if response is not JSON
            }
            console.error('Error response from backend:', errorMsg);
            chatResultDiv.innerHTML = `<p style="color: red;">${errorMsg}</p>`;
            return; // Stop execution
        }

        // Parse the successful JSON response
        const data = await response.json();

        // Display the response from Gemini
        if (data.response) {
            // Use textContent to prevent potential HTML injection if the response contains HTML characters
            // If you *expect* HTML from Gemini, keep innerHTML, but be aware of security risks.
            const p = document.createElement('p');
            p.textContent = data.response;
            chatResultDiv.innerHTML = ''; // Clear previous content/loading indicator
            chatResultDiv.appendChild(p);
        } else {
            // Handle cases where the response was successful (2xx) but didn't contain the expected data
            console.error('Successful response, but no "response" field found in data:', data);
            chatResultDiv.innerHTML = `<p style="color: orange;">Received response, but couldn't find the answer content.</p>`;
        }

    } catch (error) {
        // Handle network errors (e.g., backend server not running, CORS issue not caught above)
        console.error('Network or fetch error:', error);
        chatResultDiv.innerHTML = `<p style="color: red;">Failed to connect to the backend server. Is it running? Is CORS configured correctly?</p>`;
    }
}

// Send button for chat input functionality
const sendChatButton = document.getElementById('sendChat');
const chatInput = document.getElementById('chatInput');

if (sendChatButton && chatInput) {
    sendChatButton.addEventListener('click', () => {
        const userPrompt = chatInput.value;
        if (userPrompt.trim() !== "") {
            getGeminiResponse(userPrompt);
            // Optional: Clear the input field after sending
            // chatInput.value = '';
        } else {
            alert("Please enter a question or prompt in the input field.");
        }
    });

    // Optional: Allow sending by pressing Enter in the input field
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if it's in a form
            sendChatButton.click(); // Trigger the send button's click handler
        }
    });

} else {
    console.warn("Warning: sendChat button or chatInput element not found.");
}


// Chat button (in sidebar) click for prompting Gemini
const sidebarChatButton = document.querySelector('.sidebar .chat-button'); // More specific selector

if (sidebarChatButton) {
    sidebarChatButton.addEventListener('click', () => {
        const userPrompt = prompt('What would you like to ask Gemini?'); // Simple browser prompt
        if (userPrompt && userPrompt.trim() !== "") { // Check if prompt is not null and not empty
            getGeminiResponse(userPrompt);
        } else if (userPrompt !== null) { // User clicked OK but entered nothing
             alert("You didn't enter a question.");
        }
        // If user clicks Cancel, userPrompt will be null, and nothing happens.
    });
} else {
     console.warn("Warning: Sidebar chat button (.sidebar .chat-button) not found.");
}


console.log("Frontend script loaded. API base URL:", API_BASE_URL);

