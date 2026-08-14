import { readFileSync } from 'fs';

const env = readFileSync('.env', 'utf8');
const key = env.match(/GEMINI_API_KEY=(.*)/)[1].trim();

const prompt = `You are an expert full-stack TypeScript engineer acting as an autonomous Development Agent for SDLC Automation.
Requirement: [RQ-003] User Login Authentication
Return a JSON array of objects with "path" and "content".`;

async function test() {
  const models = ['gemini-flash-latest', 'gemini-3.7-flash', 'gemini-2.5-flash-lite', 'gemini-pro-latest'];
  for (const m of models) {
    console.log(`Testing model: ${m}`);
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Response: ${text.slice(0, 300)}`);
  }
}

test();
