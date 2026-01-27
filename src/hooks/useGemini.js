import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDYcmEQIFH4zzrJExBuWGoMUnJTstdnGSI";
const genAI = new GoogleGenerativeAI(API_KEY);

export function useGemini() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateResponse = async (prompt, modelName = "gemini-flash-latest") => {
        setLoading(true);
        setError(null);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (err) {
            console.error("Gemini API Error:", err);
            if (err.message.includes('429')) {
                setError("Daily API Quota Exceeded (Free limit). Please try again later.");
            } else {
                setError("Failed to generate response. Please try again.");
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { generateResponse, loading, error };
}
