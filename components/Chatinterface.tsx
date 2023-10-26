"use client";
import React, { useState, useRef } from "react";
import chapGPT from "./openApi";
import DOMPurify from "dompurify";

function ChatInterface() {
  // State to keep track of user's input
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  // State to keep track of the conversation
  const [conversation, setConversation] = useState([
    { sender: "User", message: "How are you?" },
    {
      sender: "ChatGPT",
      message:
        "I'm just a program, so I don't have feelings, but I'm functioning as expected!",
    },
  ]);

  // useRef to reference the input element
  const inputRef = useRef(null);
  function simulateTypingEffect(message:string, delay = 30) {
    return new Promise(async (resolve) => {
      let typedMessage = "";
  
      for (let char of message) {
        typedMessage += char;
        setConversation((prevConversation) => [
          ...prevConversation.slice(0, prevConversation.length - 1), // All messages except the last one
          {
            sender: "ChatGPT",
            message: typedMessage,
          },
        ]);
  
        await new Promise((r) => setTimeout(r, delay));
      }
  
      resolve();
    });
  }
  
  async function handleSubmit() {
    // Add user's input to the conversation immediately
    setConversation((prevConversation) => [
      ...prevConversation,
      { sender: "User", message: inputText },
      { sender: "ChatGPT", message: "..." }, // Placeholder for ChatGPT's response
    ]);
  
    setInputText("");
    setIsLoading(true);
  
    try {
      const gptResponse = await chapGPT(inputText);
      console.log("gptResponse", gptResponse);
  
      const sanitizedMessage = DOMPurify.sanitize(gptResponse || " ");
  
      // Remove the placeholder and simulate typing effect
      await simulateTypingEffect(sanitizedMessage || "Some Error in the response");
  
    } catch (error) {
      // Remove the placeholder and display an error message in the chat interface
      setConversation((prevConversation) => [
        ...prevConversation.slice(0, prevConversation.length - 1), // All messages except the last one
        {
          sender: "ChatGPT",
          message:
            "Sorry, there was an error processing your request. Please try again.",
        },
      ]);
  
      console.error("Error calling the API:", error); // Log the error for debugging
    }
  
    setIsLoading(false);
  }
  

  // Handle pressing Enter to submit
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="h-screen w-screen p-8 flex items-center justify-center bg-gray-100">
      <div className="flex flex-col h-full w-full bg-white rounded-xl shadow-md">
        <div className="p-6 flex flex-col justify-between h-full">
          <div className="text-xl font-medium text-black mb-2">
            Chat with ChatGPT
          </div>
          <div className="text-gray-500 overflow-y-auto flex-grow border border-gray-200 p-2 rounded">
            {/* Display the conversation messages */}
            {conversation.map((item, index) => (
              <p key={index}>{`${item.sender}: ${item.message}`}</p>
            ))}
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              placeholder="Type your question or statement..."
              className="p-2 flex-grow border border-gray-200 rounded"
              value={inputText}
              ref={inputRef}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {isLoading ? (
              <div className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">
                Loading...
              </div>
            ) : (
              <button
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
