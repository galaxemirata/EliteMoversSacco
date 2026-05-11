import React, { useState } from 'react';

function ChatBot() {

    // GET USERNAME FROM LOCAL STORAGE
    const username = localStorage.getItem("username");

    const [open, setOpen] = useState(false);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: username
                ? `Hello ${username} Welcome to Elite Movers. How can we help you?`
                : "Hello customer Welcome to Elite Movers. How can we help you?"
        }
    ]);

    const [input, setInput] = useState("");

    const handleSend = () => {

        if (!input.trim()) return;

        const userMessage = {
            sender: "user",
            text: input
        };

        let botReply = {
            sender: "bot",
            text: "Please click About in the navigation bar, get the contact details and raise your issue."
        };

        // SIMPLE AUTO RESPONSES
        if (input.toLowerCase().includes("payment")) {

            botReply.text =
                "If your MPESA payment failed, wait for confirmation SMS then try again.";

        } else if (input.toLowerCase().includes("booking")) {

            botReply.text =
                "For booking issues, ensure you selected the correct route and seat.";

        } else if (input.toLowerCase().includes("refund")) {

            botReply.text =
                "Refunds are processed within 24 hours.";

        } else if (input.toLowerCase().includes("hello")) {

            botReply.text = username
                ? `Hello ${username}, how can we assist you today?`
                : "Hello there, How can we assist you today?";
        }

        setMessages([...messages, userMessage, botReply]);

        setInput("");
    };

    return (
        <div>

            {/* CHAT BUTTON */}
            <button
                className="btn btn-info chatbot-btn"
                onClick={() => setOpen(!open)}
            >
                Issue?
            </button>

            {/* CHAT WINDOW */}
            {
                open && (
                    <div className="chatbot-container">

                        <div className="chatbot-header">
                            Elite Movers Support
                        </div>

                        <div className="chatbot-body">

                            {
                                messages.map((msg, index) => (
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
                                ))
                            }

                        </div>

                        <div className="chatbot-footer">

                            <input
                                type="text"
                                placeholder="Type your issue..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="form-control"
                            />

                            <button
                                className="btn btn-primary mt-2"
                                onClick={handleSend}
                            >
                                Send
                            </button>

                        </div>

                    </div>
                )
            }

        </div>
    );
}

export default ChatBot;