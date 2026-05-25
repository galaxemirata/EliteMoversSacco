import React, { useState, useEffect } from "react";

function ChatBot() {
  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Function to load latest username
  const loadUsername = () => {
    const storedUsername = localStorage.getItem("username") || "";
    setUsername(storedUsername);

    setMessages([
      {
        sender: "bot",
        text: storedUsername
          ? `Hello ${storedUsername}, Welcome to Elite Movers. How can we help you?`
          : "Hello customer, Welcome to Elite Movers. How can we help you?",
      },
    ]);
  };

  // Run once when component mounts
  useEffect(() => {
    loadUsername();
  }, []);

  // Run every time chat opens
  useEffect(() => {
    if (open) {
      loadUsername();
    }
  }, [open]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    let botReply = {
      sender: "bot",
      text:
        "Please click About in the navigation bar, get the contact details and raise your issue.",
    };

    const userInput = input.toLowerCase();

    if (userInput.includes("payment")) {
      botReply.text =
        "If your MPESA payment failed, wait for confirmation SMS then try again.";
    } else if (userInput.includes("booking")) {
      botReply.text =
        "For booking issues, ensure you selected the correct route and seat.";
    } else if (userInput.includes("refund")) {
      botReply.text = "Refunds are processed within 24 hours.";
    } else if (userInput.includes("hello")) {
      botReply.text = username
        ? `Hello ${username}, how can we assist you today?`
        : "Hello there, how can we assist you today?";
    }

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput("");
  };

  return (
    <div>
      <button
        className="btn btn-info chatbot-btn"
        onClick={() => setOpen(!open)}
      >
        Help
      </button>

      {open && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            Elite Movers Support
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "user-message"
                    : "bot-message"
                }
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-footer">
            <input
              type="text"
              placeholder="Type your issue..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-control"
              onKeyDown={(e) =>
                e.key === "Enter" && handleSend()
              }
            />

            <button
              className="btn btn-primary mt-2"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;