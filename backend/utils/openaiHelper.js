import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export const generateDetailedReview = async (topic) => {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       temperature: 0.72,
//       messages: [
//         {
//           role: "system",
//           content: `You are a professional blog writer creating authentic content. Strict rules:
//           1. Use <p style="color:#005f73; font-weight:bold;"> for subheadings
//           2. No first-person pronouns (I, me, my)
//           3. No second-person pronouns (you, your)
//           4. Share experiences through observations, not personal anecdotes
//           5. Keep pros/cons in HTML lists
//           6. Use sensory details without personal ownership
//           7. Include subtle imperfections in writing
//           8. Maintain natural flow with conversational connectors`
//         },
//         {
//           role: "user",
//           content: `Create a blog post about ${topic} following this structure:
          
//           [Unique Title Without "Review"]
//           [Opening with universal experience]
          
//           <Feature 1 Subheading>
//           - Technical details presented as discoveries
//           - Real-world application examples
          
//           <Feature 2 Subheading>
//           - Comparative observations
//           - Unexpected usage scenarios
          
//           <Feature 3 Subheading>
//           - Long-term performance notes
//           - Maintenance considerations
          
//           [Natural ending with forward-looking statement]
          
//           Example style:
//           "Morning commutes reveal a 23% reduction in cabin noise. 
//           Coffee stains on test model cup holders tell stories of 
//           rushed workday departures, yet show remarkable stain resistance."`
//         }
//       ],
//       max_tokens: 1300
//     });

//     const sanitizeOutput = (text) => {
//       return text
//         .replace(/\b(I|me|my|you|your)\b/gi, '')
//         .replace(/\.\s*?However,/g, ', while')
//         .replace(/One might notice/g, 'Practical testing reveals')
//         .replace(/It is felt that/g, 'Observations indicate')
//         .replace(/Personal experience shows/g, 'Data suggests');
//     };

//     return sanitizeOutput(response.choices[0].message.content.trim());
    
//   } catch (error) {
//     console.error("Generation Error:", error);
//     return "New content is currently being prepared - please check back soon.";
//   }
// };

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