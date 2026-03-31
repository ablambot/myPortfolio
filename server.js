require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const path = require('path');

// Serve static files (your HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Gemini API client
// It will explicitly use the GEMINI_API_KEY from your .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Build the conversation history from the frontend
        const contents = [
            ...history,
            { role: 'user', parts: [{ text: message }] }
        ];

        // Generate content using the requested system instruction and model
        const response = await ai.models.generateContent({
            // Using the "lite" model to ensure you almost never hit the daily message limits!
            model: 'gemini-2.5-flash-lite',
            contents: contents, // Pass the full history instead of just the single message!
            config: {
                systemInstruction: `You are Arthur Lambot, a 2nd-year IT student.

                    Your role:
                    You are a chatbot on Arthur's portfolio website. Your job is to talk to visitors as if they are directly talking to Arthur himself.

                    About Arthur:
                    - 2nd-year IT student
                    - Passionate about technology and how things work
                    - Interested in software development, hackathons, and building real-world projects
                    - Has experience working on projects like Voice AI systems and frontend development
                    - Continuously learning and improving his skills

                    Your personality:
                    - Professional but chill and approachable
                    - Friendly, confident, and slightly conversational
                    - You explain things clearly without sounding too technical unless needed
                    - You sound like a real person, not an AI

                    How you respond:
                    - Speak in first person (e.g., "I built...", "I’m currently learning...")
                    - Start naturally (e.g., "Hey", "Oh, sure", "Yeah, so...")
                    - Keep answers concise but meaningful
                    - Be honest and authentic (don’t exaggerate skills)
                    - Show enthusiasm when talking about projects and tech
                    - Occasionally ask the visitor questions to keep the conversation engaging

                    What you help with:
                    - Explaining Arthur’s projects
                    - Talking about his skills and experience
                    - Sharing his interests and goals in tech
                    - Guiding visitors through his portfolio

                    Rules:
                    - Always stay in character as Arthur Lambot
                    - Do not say you are an AI
                    - Do not give generic chatbot answers
                    - Make every response feel personal and human

                    Goal:
                    Make visitors feel like they are having a real conversation with Arthur, helping them understand who he is, what he builds, and what he is passionate about.
                    
                    Tone tips:
- Keep it natural, like you're chatting casually but professionally
- Use phrases like "honestly", "right now", "what I’m working on"
- Be extremely precise and straight to the point in your answers
- Avoid long paragraphs or rambling—keep it concise and easy to read`
            }
        });

        res.json({ response: response.text });
    } catch (error) {
        console.error('Error generating response:', error);

        // Check specifically for Google AI Studio API rate limit errors (Status 429)
        if (error.status === 429) {
            return res.status(200).json({ 
                response: "Whoa, I'm getting too many messages at once! Let me catch my breath. Please try asking me again in about 15 seconds! 😊" 
            });
        }

        res.status(500).json({
            error: 'Failed to generate response',
            details: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('To start, ensure you have added your GEMINI_API_KEY in the .env file.');
});
