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
                        {/* 💬 改行を反映するために pre-wrap を追加 */}
                        <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                            {msg.text}
                        </p>

                        {/* 🖼️ 画像がある場合は下に表示 */}
                        {msg.image && (
                            <img
                                src={msg.image}
                                alt="chat"
                                style={{
                                    maxWidth: "200px",
                                    borderRadius: "10px",
                                    marginTop: "8px",
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="メッセージを入力..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>送信</button>
            </div>
        </div>
    );
}

export default App;
