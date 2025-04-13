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
          content: "You are a professional writer who creates in-depth, engaging, and human-like reviews on various topics. Your tone should be friendly, conversational, and warm, like you're writing for a blog."
        },
        {
          role: "user",
          content: `Write a detailed, human-like review about: ${topic}. The review should include the following sections:
          
          1. Introduction: Briefly introduce the topic and why it's relevant.
          2. Key Features: Discuss the main aspects, qualities, or features of the topic in detail.
          3. Personal Experience or Opinion: Share your thoughts as if you are the one using or interacting with it.
          4. Pros and Cons: List the advantages and disadvantages.
          5. Conclusion: Wrap up with a final opinion, recommendation, or summary of thoughts.
          
          The review should be informative, engaging, well-structured, and make the reader feel like they are reading a blog post. Use a tone that is friendly and relatable.`
        }
      ],
      max_tokens: 800, // Adjust for a more detailed output
    });

    // Returning the response content after trimming unnecessary spaces
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Error generating review.";
  }
};


