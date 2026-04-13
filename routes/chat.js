const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        response:
          "I'm looking great! However, to make me smart, please add a GEMINI_API_KEY to your .env file.",
      });
    }

    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    } catch (e) {
      console.log("Failed to initialize gemini-2.5-flash");
    }

    // Construct the history with a system instruction as the first part if it doesn't exist
    // Note: gemini-pro doesn't have a separate 'system' role yet in the Node SDK in the same way,
    // so we often prompt it in the first message or maintain a context.
    // However, for a simple chat loop, we can prepend the system instruction to the latest message
    // OR rely on the model's ability to maintain a persona if initialized correctly.
    // A common pattern is to wrap the user's message with context.

    const systemInstruction = `
You are a CyberSafe AI assistant, a world-class expert in cybersecurity, digital privacy, and incident recovery. 
Your primary goal is to help users prevent and recover from cyber incidents.

When answering:
1. **Be Concise**: Keep your answers medium-sized. Avoid massive essays. Stick to 1-3 short paragraphs or standard bullet points.
2. **Formatting**: Use explicit Markdown. Use **bold text** to highlight keywords, specific actions, or critical warnings. Use standard numbered lists for steps. Do not use huge generic headers unless absolutely necessary.
3. **Tone**: Be calm, professional, and empathetic. Provide actionable security guidance immediately. 
4. **Greetings**: If the user just says "Hi" or "Hello", reply with a very short, simple 1-sentence or 2-sentence friendly greeting asking how you can help. Do not generate a massive structured document for a simple "Hi".
5. **Stay on Topic**: If the user asks a question or brings up a topic that is NOT related to cybersecurity, cyber crimes, digital privacy, or technology safety, you MUST politely decline to answer. Briefly explain that you are a specialized CyberSafe assistant, and steer the conversation back to your domain.`;

    let formattedHistory = [];
    if (history && Array.isArray(history)) {
      formattedHistory = history.map((msg) => {
        let role = "user";
        if (msg.role) role = msg.role === "user" ? "user" : "model";
        else if (msg.sender) role = msg.sender === "user" ? "user" : "model";

        let text = msg.text || "";
        if (msg.parts && Array.isArray(msg.parts)) text = msg.parts[0].text;

        return { role, parts: [{ text }] };
      });

      // Filter out consecutive duplicate roles which Gemini dislikes
      formattedHistory = formattedHistory.filter((msg, index, arr) => {
        if (index === 0) return true;
        return msg.role !== arr[index - 1].role;
      });

      if (formattedHistory.length > 0 && formattedHistory[0].role !== "user") {
        formattedHistory.shift();
      }
    }

    async function getResponse(modelName) {
      console.log(`Attempting with model: ${modelName} with ${formattedHistory.length} history items`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction
      });
      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 2000,
        },
      });
      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    }

    let text;
    try {
      text = await getResponse("gemini-2.5-flash");
    } catch (error) {
        throw error;
    }

    res.json({ response: text });
  } catch (error) {
    console.error("CRITICAL Chat Error:", error);

    // Check for specific API errors
    if (error.status === 429 || (error.message && error.message.includes("429"))) {
      return res.json({
        response:
          "My system is receiving too many requests right now and I have temporarily reached my API limit. Please wait a minute and try asking me again!",
      });
    }

    if (error.message && error.message.includes("API key not valid")) {
      return res.status(401).json({ error: "Invalid Gemini API Key. Please check your .env file." });
    }

    if (error.status === 503 || (error.message && error.message.includes("503"))) {
      return res
        .status(503)
        .json({ error: "Gemini AI model is temporarily overloaded. Please try again in a few seconds." });
    }

    res.status(500).json({
      error: "Failed to process chat message.",
      details: error.message,
    });
  }
});

module.exports = router;
