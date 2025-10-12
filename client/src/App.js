import React, { useState } from "react";
import "./App.css";

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const [sceneImage, setSceneImage] = useState("");
    const [sceneDesc, setSceneDesc] = useState("");
    const [sceneStatus, setSceneStatus] = useState("");
    const [loadingScene, setLoadingScene] = useState(false);

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
            const aiMessage = { sender: "ai", text: data.reply, image: data.image };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            console.error(err);
        }
    };

    const addScene = async () => {
        if (!sceneImage.trim() || !sceneDesc.trim()) {
            setSceneStatus("⚠️ 画像URLと説明を入力してね");
            return;
        }
        setLoadingScene(true);
        setSceneStatus("📤 登録中…");

        try {
            const res = await fetch("https://gemini-chat-server-1.onrender.com/add-scene", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: sceneImage, description: sceneDesc }),
            });
            const data = await res.json();

            if (data.error) {
                setSceneStatus("❌ 登録失敗: " + data.error);
            } else {
                setSceneStatus("✅ 登録完了: " + data.scene.description);
                setSceneImage("");
                setSceneDesc("");
                setTimeout(() => setSceneStatus(""), 3000);
            }
        } catch (err) {
            console.error(err);
            setSceneStatus("💦 サーバー接続エラー");
        } finally {
            setLoadingScene(false);
        }
    };

    return (
        <div className="chat-container">
            <h2 className="title">💗 Gemini Chat 💗</h2>

            {/* 💬 チャット欄 */}
            <div className="chat-box">
                {messages.map((msg, i) => (
                    <div key={i} className={`bubble ${msg.sender}`}>
                        <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                            {msg.text}
                        </p>
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

            {/* 🎨 シーン登録フォーム */}
            <div className="scene-form">
                <h3>🎨 シーン登録フォーム</h3>

                <input
                    type="text"
                    value={sceneImage}
                    onChange={(e) => setSceneImage(e.target.value)}
                    placeholder="画像URLを入力"
                />

                <textarea
                    value={sceneDesc}
                    onChange={(e) => setSceneDesc(e.target.value)}
                    placeholder="シーンの説明（例：ももかさんがたいようくんの服を脱がせている）"
                    rows="3"
                ></textarea>

                <button onClick={addScene} disabled={loadingScene}>
                    {loadingScene ? "登録中..." : "登録する💾"}
                </button>

                {sceneStatus && <p>{sceneStatus}</p>}
            </div>

            {/* ✏️ 入力エリア */}
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
