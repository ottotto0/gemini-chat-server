import React, { useState } from "react";
import "./App.css";

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const res = await fetch("https://gemini-chat-server-1.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();
            const aiMessage = {
                sender: "ai",
                text: data.reply,
                image: data.image,
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="chat-container">
            <h2 className="title">💗 Gemini Chat 💗</h2>
            <div className="chat-box">
                {messages.map((msg, i) => (
                    <div key={i} className={`bubble ${msg.sender}`}>
                        {msg.text}
                        {msg.image && <img src={msg.image} alt="chat" />}
                    </div>
                ))}
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="メッセージを入力..."
                />
                <button onClick={sendMessage}>送信</button>
            </div>
        </div>
    );
}

export default App;

