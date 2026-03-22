const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateBlogPost(imageUrls, { locations, dates }) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: [
        ...imageUrls.map((url) => ({ type: 'image_url', image_url: { url, detail: 'low' } })),
        {
          type: 'text',
          text: `אלו ${imageUrls.length} תמונות מטיול.
מיקומים: ${locations.filter(Boolean).join(', ') || 'לא ידוע'}
תאריכים: ${dates.filter(Boolean).join(', ') || 'לא ידוע'}
כתוב פוסט בלוג מרתק בעברית. החזר JSON בלבד:
{"title":"...","body":"..."}`,
        },
      ],
    }],
  });

  const raw = response.choices[0].message.content;
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return { title: 'הרפתקה חדשה', body: raw };
  }
}

module.exports = { generateBlogPost };
