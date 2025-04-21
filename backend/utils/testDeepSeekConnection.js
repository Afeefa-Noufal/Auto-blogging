import { deepseek, cleanAndParseJSON } from "./openaiHelper.js"; // Adjust import path


export const testDeepSeekConnection = async () => {
  try {
    const response = await deepseek.post("/chat/completions", {
      model: "deepseek-chat",
      messages: [
        { role: "user", content: "Say OK in JSON: {\"ok\": true}" }
      ],
      temperature: 0,
      response_format: { type: "json_object" },
      max_tokens: 50,
    });

    const parsed = cleanAndParseJSON(response.data.choices[0].message.content);

    if (parsed.ok === true) {
      console.log("✅ DeepSeek is connected and responsive.");
      return true;
    } else {
      console.log("⚠️ DeepSeek responded, but not as expected:", parsed);
      return false;
    }
  } catch (error) {
    console.error("❌ DeepSeek connection failed:", {
      message: error.message,
      ...(error.response && {
        status: error.response.status,
        data: error.response.data
      }),
    });
    return false;
  }
};
