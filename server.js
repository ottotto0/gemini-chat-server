import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(message);
  const reply = result.response.text();

  const image = chooseImage(reply);
  res.json({ reply, image });
});

function chooseImage(text) {
  if (text.includes("ナース")) return "https://i.imgur.com/nurse.jpg";
  if (text.includes("検温")) return "https://i.imgur.com/thermo.jpg";
  if (text.includes("清拭")) return "https://i.imgur.com/clean.jpg";
  return "https://i.imgur.com/default.jpg";
}

app.listen(3000, () => console.log("Server running on port 3000"));


const app = express();

const PORT = process.env.PORT || 3000;

// ★ここを追加！
app.get("/", (req, res) => {
  res.send("🌸 Gemini Chat Image App is running! 🌸");
});

// 他のAPIルート（例：/chat）などがあるならそのままでOK

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
