import React, { useState } from "react";
import { GenerativeLanguage } from "@google/generative-ai";
import "./App.css";

const backgroundImages = [
  "https://source.unsplash.com/1600x900/?beach",
  "https://source.unsplash.com/1600x900/?mountains",
  "https://source.unsplash.com/1600x900/?forest",
  "https://source.unsplash.com/1600x900/?cityscape",
  "https://source.unsplash.com/1600x900/?desert",
];

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [bgImage, setBgImage] = useState(backgroundImages[0]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Configure the Gemini API
      const genAI = new GenerativeLanguage({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY, // Set your Google API Key
      });

      const completion = await genAI.generateText({
        model: "models/text-bison-001", // Replace with the Gemini model ID
        prompt: `Travel chatbot: Answer the following query in a formatted style.\n\nQuery: ${query}`,
        temperature: 0.7,
        maxOutputTokens: 1024,
      });

      const formattedResponse = completion.data?.candidates[0]?.output || "No response received.";
      setResponse(formattedResponse);

      // Change background image randomly
      const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
      setBgImage(randomImage);
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred. Please try again later.");
    }
  };

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        filter: "brightness(0.7)",
      }}
    >
      <div className="content">
        <h1 className="title">Travel Chatbot</h1>
        <form onSubmit={handleSubmit} className="form">
          <textarea
            className="query-box"
            placeholder="Enter your travel-related query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
        <div className="response-box">
          <h2>Response:</h2>
          <pre>{response}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
