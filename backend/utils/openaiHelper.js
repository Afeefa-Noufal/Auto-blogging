import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateDetailedReview = async (topic) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content: `Create professional blog content with strict formatting rules:
          1. Main title: Plain text
          2. Subtitle line: <p style="color:#777777; margin-top:-4px; font-size:0.95em;">[text]</p>
          3. Subheadings: <p style="font-weight:700; color:#000000; margin:15px 0 8px 0;">[text]</p>
          4. Use HTML lists (<ul><li>)
          5. No markdown symbols (#, *, -)
          6. Third-person perspective
          7. Data-driven insights`
        },
        {
          role: "user",
          content: `Create content about ${topic} structured as:

          [Main Title]
          <p style="color:#777777; margin-top:-4px; font-size:0.95em;">Subtitle text here</p>
          
          Opening paragraph with compelling statistic...
          
          <p style="font-weight:700; color:#000000; margin:15px 0 8px 0;">Section 1</p>
          Technical details and analysis...
          
          <p style="font-weight:700; color:#000000; margin:15px 0 8px 0;">Section 2</p>
          Comparative observations...
          
          <p style="font-weight:700; color:#000000; margin:15px 0 8px 0;">Section 3</p>
          Long-term performance notes...
          
          Closing insights`
        }
      ],
      max_tokens: 1200
    });

    const sanitizeOutput = (text) => {
      return text
        .replace(/[#*-]/g, '') // Remove all markdown symbols
        .replace(/\*\*/g, '') // Remove double asterisks
        .replace(/<p>/g, '<p style="margin-bottom:12px; line-height:1.5;">') // Base paragraph styling
        .replace(/<ul>/g, '<ul style="margin:15px 0 15px 25px; list-style-type:square;">');
    };

    return sanitizeOutput(response.choices[0].message.content.trim());
    
  } catch (error) {
    console.error("Content Generation Error:", error);
    return "New content is being prepared - please check back shortly for updated insights.";
  }
};