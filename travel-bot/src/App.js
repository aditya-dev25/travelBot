import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./App.css";

// Define background images array
const backgroundImages = [
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1661827829070-5b0615c41ba1?q=80&w=1793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1494783367193-149034c05e8f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseVisible, setResponseVisible] = useState(false); // Controls visibility of response box

  // Gemini API setup
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const genai = new GoogleGenerativeAI(apiKey);
  const model = genai.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  // Function to handle query submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); 
    setResponse(''); // Clear previous response

    // Hide the response box every time the button is clicked
    setResponseVisible(false);

  
    try {
      const result = await model.generateContent(query);
      // Call the function to extract the text from the result
      const responseText = result.response.text ? result.response.text() : "No response received."; // Ensure to call the function if it's a function
      
      // Pass the response text through the formatResponse function for styling
      setResponse(formatResponse(responseText));  // Format the response before setting it
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
      setResponseVisible(true); // Show the response box after receiving the response
    }
  };
   

  // Function to format the response (handles HTML elements)
  const formatResponse = (text) => {
  if (typeof text !== 'string') {
    // If the text is not a string, convert it to an empty string or handle the error
    console.error('Expected string, but got:', typeof text);
    return '';  // You can return an empty string or a default error message
  }

  // Replace newlines and HTML elements
  return text
    .replace(/(?:\r\n|\r|\n)/g, "<br>") // New line to <br> for HTML display
    .replace(/\*(.*?)\*/g, "<b>$1</b>") // Bold markdown
    .replace(/_(.*?)_/g, "<i>$1</i>") // Italics markdown
    .replace(/~(.*?)~/g, "<del>$1</del>") // Strikethrough markdown
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>'); // Links
};
   

  // Set up background image switching on component mount
  useEffect(() => {
    let index = 0;
    document.title = "Travel Chatbot";
  
    // Set up a container for background images
    const backgroundContainer = document.createElement('div');
    backgroundContainer.style.position = 'fixed';
    backgroundContainer.style.top = '0';
    backgroundContainer.style.left = '0';
    backgroundContainer.style.width = '100%';
    backgroundContainer.style.height = '100%';
    backgroundContainer.style.zIndex = '-1';  // Place it behind the content
    backgroundContainer.style.transition = "background-image 2s ease-in-out"; // Transition for background change
    document.body.appendChild(backgroundContainer); // Append the container to the body
  
    const interval = setInterval(() => {
      backgroundContainer.style.backgroundImage = `url(${backgroundImages[index]})`;
      backgroundContainer.style.backgroundSize = "cover";
      backgroundContainer.style.backgroundPosition = "center";
      index = (index + 1) % backgroundImages.length; // Cycle through the images
    }, 30000); // Change background every 30 seconds
  
    // Cleanup on component unmount
    return () => {
      clearInterval(interval);
      document.body.removeChild(backgroundContainer);
    };
  }, []);  


  return (
    <div className="app">
      <div className="content">
        <h1 className="title">Travel Chatbot</h1>
        <form onSubmit={handleSubmit} className="form">
          <textarea
            className="query-box"
            placeholder="Enter your travel-related query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
          >
            {isLoading ? "Exploring..." : "Ask Me!"} {/* Travel-related text */}
          </button>
        </form>
        {responseVisible && (
          <div className="response-box">
            <h2>Wanderlust Wisdom:</h2>
            <div
              className="response-content"
              dangerouslySetInnerHTML={{ __html: response }} // Make sure HTML formatting is preserved
              />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
