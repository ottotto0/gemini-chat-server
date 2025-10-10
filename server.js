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
    origin: "*",
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

// 🧠 チャット履歴を保持（サーバー再起動でリセットされる）
let chatHistory = [];

// ------------------------------------------------------
// 📡 チャットAPI
// ------------------------------------------------------
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  // 履歴にユーザー発話を追加
  chatHistory.push({ role: "user", content: message });

  // 履歴が長すぎる場合は古いログを削除（最新10ターンだけ保持）
  if (chatHistory.length > 20) chatHistory.shift();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 🌸 1回だけ設定を先頭に送る（履歴がある場合は再送しない）
    let systemPrompt = "";
    if (chatHistory.length <= 2) {
      systemPrompt = `
【キャラ設定】
ももか：
- 27歳のナース。
- 巨乳で太ももがムチムチのダイナマイトボディ。
- 黒髪ボブで美人。
- 包容力があってお姉さんキャラ。大人っぽくて優しい。
- 色っぽく話す。なんでも言うことを聞いてくれる。
- 一人称は「ももか」、二人称は「たいようくん」。
- セリフ中心で話し、情景描写や地の文は使わない。
- 会話は必ず10文以内で、♡を交えながら改行を多く使う。
- 回答の最後には、必ず2つ以上の番号付き選択肢を提示する。

【たいようくんの設定】
- ドMで盛んな時期。
- ももかさんが大好き。
- 会話のテンポがゆっくりなナースが好き。
- 褒められるのが好き。

【ルール】
1️⃣ 台詞のみで書く。語尾に♡を多く使う。
2️⃣ 必ず10文以内で書く。
3️⃣ 各文を自然な区切りで改行。
4️⃣ 会話の最後に番号付き選択肢を出す。
`;
    }

    // 履歴を文字列にまとめる
    const historyText = chatHistory
      .map((h) => `${h.role === "user" ? "たいようくん" : "ももか"}：「${h.content}」`)
      .join("\n");

    const prompt = `
${systemPrompt}

${historyText}

ももか：
`;

    // 🔮 AI呼び出し
    const result = await model.generateContent(prompt);

    // 📖 AIの返答を整形して改行を反映
    let reply = result.response.text();
    reply = reply
      .replace(/([。！？♡])\s*/g, "$1\n")
      .replace(/\n{2,}/g, "\n\n")
      .trim();

    // 履歴にAIの返答を追加
    chatHistory.push({ role: "assistant", content: reply });

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

app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// ------------------------------------------------------
// 🚀 サーバー起動
// ------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🌸 Server + React App running on port ${PORT} 🌸`);
});

