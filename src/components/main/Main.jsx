import React, { useState, useContext, useEffect } from "react";
import { assets } from "../../assets/assets";
import "./main.css";
import { Context } from "../../context/Context";
import axios from "axios";
import FileUploader from "./FileUploader";

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

const Main = () => {
  // const {
  //   // onSent,
  //   recentPrompt,
  //   showResults,
  //   loading,
  //   resultData,
  //   setInput,
  //   input,
  // } = useContext(Context);
  const [showResults, setShowResults] = useState(false);
  const [recentPrompt, setRecentPrompt] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState(
    "You are a helpful assistant named Ruby."
  );
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSent();
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const onSent = async () => {
    const userMessage = { role: "user", content: inputValue };
    setRecentPrompt(inputValue);
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue(""); // Clear the input after sending
    setShowResults(true);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemMessage },
            ...messages,
            userMessage,
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const aiMessage = response.data.choices[0].message;
      console.log(aiMessage);
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "system",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleFileSelect = (file) => {
    console.log("Selected file:", file);
    // process the file here
  };

  const [siteId, setSiteId] = useState(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("siteId");
    setSiteId(id);
  }, []);

  const handleCardClick = (promptText) => {
    setInputValue(promptText);
  };
  return (
    <div className="main">
      <div className="nav">
        <p>Ruby Events</p>
        <img src={assets.user} alt="" /> {/* get icon from db */}
      </div>
      <div className="main-container">
        {!showResults ? (
          <>
            <div className="greet">
              <p>Hello, Joe! {/* get username from db */}</p>
              <p>
                <span>What can I do for you today?</span>
              </p>
            </div>
            <div className="cards">
              <div
                className="card"
                onClick={() => handleCardClick("What's happening this week?")}
              >
                <p>What's happening this week? </p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick("What are the ticketing options?")
                }
              >
                <p>What are the ticketing options? </p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick("How to update an existing event?")
                }
              >
                <p>How to update an existing event?</p>
                <img src={assets.setting_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() => {
                  handleCardClick("How to create a new event? ");
                }}
              >
                <p>How to create a new event? </p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {isLoading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <div>
                  {messages
                    .filter((message) => message.role === "assistant")
                    .map((message, index) => (
                      <div key={index} className={`message ${message.role}`}>
                        {message.content}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box bottom-info">
            <input
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              value={inputValue}
              type="text"
              placeholder="Enter the Prompt Here"
            />
            <div>
              <FileUploader onFileSelect={handleFileSelect} />
              <img src={assets.mic_icon} alt="" />{" "}
              {/* use react-speech-recognition for mic */}
              <img
                src={assets.send_icon}
                alt=""
                onClick={() => {
                  onSent();
                }}
              />
            </div>
          </div>
          {/* <div className="bottom-info">
						<p>
							Gemini may display inaccurate info, including about people, so
							double-check its responses. Your privacy & Gemini Apps
						</p>
					</div> */}
        </div>
      </div>
    </div>
  );
};

export default Main;
