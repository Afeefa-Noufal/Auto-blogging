import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Initialize APIs
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const deepseek = axios.create({
  baseURL: "https://api.deepseek.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.DEEPSDK_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const cleanAndParseJSON = (rawResponse) => {
  let fixed = "";
  let sanitized = "";

  try {
    // Remove code block wrappers and extra text
    sanitized = rawResponse
      .replace(/```json|```/g, '')
      .replace(/^[^{]*/, '')
      .replace(/[^}]*$/, '')
      .trim();

    // Fix invalid keys (unquoted or single-quoted keys)
    fixed = sanitized.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

    // Remove trailing commas
    fixed = fixed.replace(/,\s*([}\]])/g, '$1');

    // Optional: fix quotes only around keys, not inside strings
    // Keep inner single quotes like "Gaza's"
    // Ensure entire string is valid JSON
    return JSON.parse(fixed);
  } catch (error) {
    console.error("JSON Sanitization Failed:", {
      rawResponse,
      sanitized,
      fixed,
      error: error.message
    });
    throw new Error(`JSON parsing failed after sanitization: ${error.message}`);
  }
};



//fetch deepseek data
const fetchDeepSeekData = async (topic) => {
  try {
    const response = await deepseek.post("/chat/completions", {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are a technical writer. Respond ONLY with valid JSON using this exact structure:
            {
              "key_facts": ["fact1", "fact2"],
              "analysis": ["point1", "point2"]
            }
            Do not include any other text or explanations.`
        },
        {
          role: "user",
          content: `Provide technical insights about ${topic} in strict JSON format with: key_facts, analysis`
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
      max_tokens: 2000
    });

    return cleanAndParseJSON(response.data.choices[0].message.content);
  }catch (error) {
      console.error("DeepSeek API Failure:", {
        message: error.message,
        ...(error.response && {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
        }),
      });
      return getFallbackTechnicalData(topic);
    }
    
};



// Generate combined blog content
export const generateDetailedReview = async (topic) => {
  try {
    const [deepSeekData, openaiResponse] = await Promise.allSettled([
      fetchDeepSeekData(topic),
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: `Write engaging and natural content about "${topic}". Use a storytelling approach and highlight key market trends. Avoid personal pronouns like I, you, we. Keep the tone neutral yet polished. Do not include markdown formatting like ### or **. End with a clean, insightful conclusion.`
        }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    ]);

    const technicalData = deepSeekData.status === 'fulfilled'
      ? deepSeekData.value
      : { key_facts: [], comparative_analysis: [] };

    const narrativeContent = openaiResponse.status === 'fulfilled'
      ? openaiResponse.value.choices[0]?.message?.content || ""
      : "Our experts are currently updating this analysis. Please check back later for comprehensive insights.";

    return formatBlogContent(topic, technicalData, narrativeContent);
  } catch (error) {
    console.error("Generation Error:", error);
    return `
      <h1>${topic.charAt(0).toUpperCase() + topic.slice(1)}</h1>
      <p style="color:#777777; margin-top:-4px; font-size:0.95em;">
        New content is being prepared - please check back shortly for updated insights.
      </p>
    `;
  }
};

const formatBlogContent = (topic, technicalData = {}, narrative = "") => {
  const safeData = {
    key_facts: technicalData.key_facts || [],
    comparative_analysis: technicalData.comparative_analysis || []
  };

  const firstLine = narrative.split('\n').find(line => line.trim()) || "Insights derived from industry developments and real-world applications.";

  const isReflectiveEnding = (line) =>
    /so[, ]|what.*\?|story.*unveil|world.*listen|ready.*to.*(listen|hear|act)/i.test(line);

  const cleanedNarrative = narrative
    .split('\n')
    .filter((line, idx) => {
      const trimmed = line.trim();
      const isHeading = /^#{1,6}\s*/.test(trimmed);                     // markdown ###
      const isFullBold = /^\*\*.*\*\*$/.test(trimmed);                 // full **bold**
      const isLabel = /^(title|chapter|conclusion|section)\s*[:\-]/i.test(trimmed);
      const isDuplicate = trimmed === firstLine.trim();
      return trimmed && !isHeading && !isFullBold && !isLabel && !isDuplicate && !isReflectiveEnding(trimmed);
    })
    .map(line =>
      line
        .replace(/^#{1,6}\s*/, '')                       // Remove markdown heading hashes
        .replace(/^\*\*(.*?)\*\*$/, '$1')                // Remove fully bolded headings
        .replace(/\*\*(.*?)\*\*/g, '$1')                 // Remove inline bold markdown
        .replace(/\*(.*?)\*/g, '$1')                     // Remove italic markdown
        .replace(/^(Title|Chapter|Conclusion|Section)\s*[:\-]\s*/i, '')
        .replace(/^\"|\"$/g, '')                         // Remove surrounding quotes
    )
    .map(line => {
      const isShortHeading = /^[A-Z][a-zA-Z\s,'-]+[.:?!-]?$/.test(line) && line.length < 100;
      return isShortHeading
        ? `<p style="font-size:1.1em; font-weight:600; margin-top:20px; margin-bottom:10px;">${line}</p>`
        : `<p style="margin-bottom:12px; line-height:1.6;">${line}</p>`;
    })
    .join('\n');

  const renderDynamicHeading = (items, fallbackHeading) => {
    if (!items.length) return '';
    const firstWords = items[0].split(' ').slice(0, 3).join(' ');
    const headingTitle = firstWords.length > 5 ? firstWords : fallbackHeading;

    return `
      <p style="font-weight:600; font-size:1.1em; margin-top:20px; margin-bottom:10px;">
        ${headingTitle}
      </p>
      <ul style="margin:10px 0 25px 25px; list-style-type: square;">
        ${items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    `;
  };

  return `
    <p style="color:#777777; margin-top:-4px; font-size:0.95em;">
      ${firstLine}
    </p>

    ${renderDynamicHeading(safeData.key_facts, "Key Highlights")}

    ${cleanedNarrative}

    ${renderDynamicHeading(safeData.comparative_analysis, "Market Comparisons")}
  `;
};









// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export const generateDetailedReview = async (topic) => {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       temperature: 0.6,
//       messages: [
//         {
//           role: "system",
//           content: `Create professional blog content with strict formatting rules:
//           1. Main title: Plain text
//           2. Subtitle line: <p style="color:#777777; margin-top:-4px; font-size:0.95em;">[text]</p>
//           3. Subheadings: <p style="font-weight:700; color:#000000; margin:15px 0 8px 0;">[text]</p>
//           4. Use HTML lists (<ul><li>)
//           5. No markdown symbols (#, *, -)
//           6. Third-person perspective
//           7. Data-driven insights`
//         },
//         {
//           role: "user",
//           content: `Create content about ${topic} structured as:

//           [Main Title]
//           <p style="color:#777777; margin-top:-4px; font-size:0.95em;">Subtitle text here</p>
          
//           Opening paragraph with compelling statistic...
          
//           <p style="font-weight:700; color:#000000; margin:15px 0 8px 0;">Section 1</p>
//           Technical details and analysis...
          
//           <p style="font-weight:700; color:#000000; margin:15px 0 8px 0;">Section 2</p>
//           Comparative observations...
          
//           <p style="font-weight:700; color:#000000; margin:15px 0 8px 0;">Section 3</p>
//           Long-term performance notes...
          
//           Closing insights`
//         }
//       ],
//       max_tokens: 1200
//     });

//     const sanitizeOutput = (text) => {
//       return text
//         .replace(/[#*-]/g, '') // Remove all markdown symbols
//         .replace(/\*\*/g, '') // Remove double asterisks
//         .replace(/<p>/g, '<p style="margin-bottom:12px; line-height:1.5;">') // Base paragraph styling
//         .replace(/<ul>/g, '<ul style="margin:15px 0 15px 25px; list-style-type:square;">');
//     };

//     return sanitizeOutput(response.choices[0].message.content.trim());
    
//   } catch (error) {
//     console.error("Content Generation Error:", error);
//     return "New content is being prepared - please check back shortly for updated insights.";
//   }
// };

