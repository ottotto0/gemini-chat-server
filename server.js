import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(
  cors({
    origin: "*", // ←どこからでもアクセスOK
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PORT = process.env.PORT || 3000;

// --- チャットAPI ---
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

// --- 画像選択ロジック ---
function chooseImage(text) {
  if (text.includes("ナース")) return "https://i.imgur.com/nurse.jpg";
  if (text.includes("検温")) return "https://i.imgur.com/thermo.jpg";
  if (text.includes("清拭")) return "https://i.imgur.com/clean.jpg";
  return "https://i.imgur.com/default.jpg";
}

// --- ルート確認用 ---
app.get("/", (req, res) => {
  res.send("🌸 Gemini Chat Image App is running! 🌸");
});

// --- サーバー起動 ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

