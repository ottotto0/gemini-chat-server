from flask import Flask, request, jsonify
import google.generativeai as genai
import os

app = Flask(__name__)

# Gemini APIキーを設定（Renderの環境変数で設定する）
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(user_message)
    return jsonify({"reply": response.text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
