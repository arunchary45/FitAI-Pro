import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export function useGemini() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getApiKey = useCallback(() => {
        // First check environment variable
        if (import.meta.env.VITE_GEMINI_API_KEY) {
            return import.meta.env.VITE_GEMINI_API_KEY;
        }

        // Then check localStorage
        let key = localStorage.getItem('gemini_api_key');
        if (!key) {
            key = prompt("Please enter your Google Gemini API Key:");
            if (key) {
                localStorage.setItem('gemini_api_key', key);
            }
        }
        return key;
    }, []);

    const generateResponse = async (prompt, modelName = "gemini-2.5-flash") => {
        setLoading(true);
        setError(null);

        try {
            const apiKey = getApiKey();
            if (!apiKey) {
                throw new Error("API Key is required to use this feature.");
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (err) {
            console.error("Gemini API Error:", err);

            // Handle specific 403 Forbidden (likely invalid/leaked key)
            if (err.message.includes('403') || err.toString().includes('403')) {
                localStorage.removeItem('gemini_api_key');
                setError("Invalid or leaked API Key. Please refresh and enter a new one.");
            }
            else if (err.message.includes('429')) {
                setError("Daily API Quota Exceeded (Free limit). Please try again later.");
            }
            else {
                setError(err.message || "Failed to generate response. Please try again.");
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { generateResponse, loading, error };
}
