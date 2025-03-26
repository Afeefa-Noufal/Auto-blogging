import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateDetailedReview = async (topic) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional writer who creates in-depth, engaging, and human-like reviews on various topics."
        },
        {
          role: "user",
          content: `Write a detailed, human-like review about: ${topic}. The review should be informative, engaging, and well-structured.`
        }
      ],
      max_tokens: 800, // Increased for detailed output
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Error generating review.";
  }
};
