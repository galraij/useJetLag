const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateStory(pictures) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_key') {
    throw new Error('Valid GEMINI_API_KEY is missing in .env');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a creative travel storyteller and data analyst. You will be provided with a series of images and corresponding metadata (JSON objects) for each.

Your Tasks:

Image Analysis: For each image, combine the visual content with the provided metadata to write a punchy, slightly witty description (e.g., "A beautiful cloudy day in Oxford; despite the gloomy sky, the vibes were warm, even if my coffee wasn't").

Narrative Construction: Look at the collection of images and data as a chronological or thematic journey. Write a cohesive "Travel Story" and then split it into logical "Story Segments" that can be interspersed between images.

POI Identification: Identify any major Points of Interest (POI) from the visuals or GPS data. Write a short, engaging informational paragraph for each.

Output Format:

Return only a valid JSON object with the following structure. Do not include markdown formatting like \`\`\`json ...\`\`\` unless specifically requested for a code block.

Required JSON Schema:
{
  "catchy_title": "string",
  "photos": [
    {
      "image_id": "string (from input)",
      "punchy_description": "string",
      "associated_story_segment": "string (a piece of the overall story that fits this moment)"
    }
  ],
  "points_of_interest": [
    {
      "name": "string",
      "description": "string"
    }
  ],
  "full_narrative_summary": "string"
}`;

  // Download all pictures into Base64 buffers
  const parts = [{ text: prompt }];
  
  for (const pic of pictures) {
    try {
      const response = await fetch(pic.url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const mimeType = pic.url.endsWith('.png') ? 'image/png' : 'image/jpeg';
      
      parts.push({
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: mimeType
        }
      });
      
      // Push metadata for this image
      parts.push({ text: `Metadata for image_id: ${pic.id} - City: ${pic.city}, Country: ${pic.country}, POI: ${pic.poi}, Date: ${pic.date_taken}, Temp: ${pic.weather_temp}°C` });
    } catch (e) {
      console.error("Failed to fetch image for Gemini:", pic.url);
    }
  }

  const result = await model.generateContent({ contents: [{ role: "user", parts }] });
  const responseText = result.response.text();
  
  try {
    const raw = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse Gemini output:', responseText);
    throw new Error('Gemini API returned invalid JSON.');
  }
}

module.exports = { generateStory };
