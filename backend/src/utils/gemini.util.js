import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateGeminiResponse = async (history, newPrompt) => {
    const formattedHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    const contents = [...formattedHistory, { role: 'user', parts: [{ text: newPrompt }] }];

    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: contents
    });

    const usage = response.usageMetadata || {};

    return {
        replyText: response.text,
        promptTokens: usage.promptTokenCount || 0,
        completionTokens: usage.candidatesTokenCount || 0,
        totalTokens: usage.totalTokenCount || 0
    };
};