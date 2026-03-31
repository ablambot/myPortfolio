require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
    try {
        console.log("Testing with model gemini-2.5-flash...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Hello',
            config: {
                systemInstruction: `Tone tips:
                    - Keep it natural, like you're chatting casually but professionally
                    - Use phrases like "honestly", "right now", "what I’m working on"
                    - Avoid long paragraphs—keep it easy to read`
            }
        });
        console.log("Success:", response.text);
    } catch (e) {
        console.error("SDK Error:", e);
    }
}
test();
