require('dotenv').config({ path: './.env' });
const apiKey = process.env.GEMINI_API_KEY;

async function run() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  const names = data.models.map(m => m.name);
  console.log(names);
}

run();
