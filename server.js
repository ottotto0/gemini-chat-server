import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ------------------------------------------------------
// 基本設定
// ------------------------------------------------------
const app = express();
app.use(
  cors({
    origin: "*", // ←どこからでもアクセスOK（あとで制限も可）
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ------------------------------------------------------
// Gemini API 初期化
// ------------------------------------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------
// 📡 チャットAPI
// ------------------------------------------------------
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const reply = result.response.text();

    const image = chooseImage(reply);
    res.json({ reply, image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gemini API呼び出し失敗" });
  }
});

// ------------------------------------------------------
// 🖼️ 画像選択ロジック
// ------------------------------------------------------
function chooseImage(text) {
  if (text.includes("ナース")) return "https://i.imgur.com/nurse.jpg";
  if (text.includes("検温")) return "https://i.imgur.com/thermo.jpg";
  if (text.includes("清拭")) return "https://i.imgur.com/clean.jpg";
  return "https://i.imgur.com/default.jpg";
}

// ------------------------------------------------------
// 🌸 Reactビルドファイルを提供
// ------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Reactのbuildフォルダを静的ファイルとして提供
app.use(express.static(path.join(__dirname, "client/build")));

// API以外のすべてのルートでReactのindex.htmlを返す
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// ------------------------------------------------------
// 🚀 サーバー起動
// ------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🌸 Server + React App running on port ${PORT} 🌸`);
});
