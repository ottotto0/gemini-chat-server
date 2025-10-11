// SceneForm.jsx
import { useState } from "react";
import "./App.css";

export default function SceneForm({ onSubmit }) {
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageUrl || !description) {
      alert("画像URLと説明を入力してね♡");
      return;
    }
    onSubmit({ imageUrl, description });
    setImageUrl("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="scene-form">
      <h3>🎀 シーン登録フォーム</h3>

      <input
        type="text"
        placeholder="画像URLを入力してね♡"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <textarea
        placeholder="シチュエーションの説明を書いてね♡"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">登録する</button>
    </form>
  );
}
