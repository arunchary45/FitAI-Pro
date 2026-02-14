// script.js

import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { API_KEY } from "./config.js";

// Initialize the AI
let genAI;

function getApiKey() {
    // 1. Try config.js (Prioritize user provided key)
    if (API_KEY) return API_KEY;

    // 2. Try environment variables (Vite)
    try {
        if (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
            return import.meta.env.VITE_GEMINI_API_KEY;
        }
    } catch (e) { }

    // 3. Fallback to localStorage (Manual entry)
    let key = localStorage.getItem('gemini_api_key');
    if (!key) {
        key = prompt("Please enter your Google Gemini API Key:");
        if (key) {
            localStorage.setItem('gemini_api_key', key);
        }
    }
    return key;
}

function initGenAI() {
    const apiKey = getApiKey();
    if (apiKey) {
        genAI = new GoogleGenerativeAI(apiKey);
    } else {
        console.warn("No API key provided");
    }
}

initGenAI();

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const generatePlanButton = document.getElementById('generate-plan');
const workoutResult = document.getElementById('workout-result');

// Chat functionality
async function sendMessage(message) {
    // Add user message to chat
    addMessage(message, 'user');

    try {
        // Get the generative model for chat
        const chatModel = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        });

        // Create a more specific fitness-focused prompt
        const chatPrompt = `You are an expert fitness trainer and nutritionist. 
        Please provide detailed, accurate, and helpful advice about fitness, workouts, or nutrition.
        If the question is not related to fitness, politely redirect to fitness topics.
        You are created by Arun Chaudhary. If anyone asks, tell them this website is created by him.
        Question: ${message}`;

        // Generate chat response
        const chatResult = await chatModel.generateContent(chatPrompt);
        const chatResponse = await chatResult.response;
        const botResponse = chatResponse.text();

        // Add bot response to chat
        addMessage(botResponse, 'bot');
    } catch (error) {
        console.error('Chat Error:', error);
        let errorMessage = 'I apologize, but I\'m having trouble processing your request. Please try again.';
        if (error.message.includes('429')) {
            errorMessage = 'I am currently receiving too many requests. Please wait a moment and try again.';
        }
        addMessage(errorMessage, 'bot');
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event Listeners for chat
sendButton.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        sendMessage(message);
        userInput.value = '';
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
            userInput.value = '';
        }
    }
});

// Workout Plan Generation
generatePlanButton.addEventListener('click', async () => {
    const fitnessLevel = document.getElementById('fitness-level').value;
    const workoutType = document.getElementById('workout-type').value;
    const duration = document.getElementById('duration').value;

    const prompt = `Create a ${duration}-minute ${workoutType} workout plan for a ${fitnessLevel} fitness level. 
    Include specific exercises, sets, reps, and rest periods. Format it in a clear, easy-to-follow structure with proper spacing and line breaks.`;

    try {
        // Get the generative model for workout plans
        const workoutModel = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-001",
            generationConfig: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        });

        // Generate workout plan
        const result = await workoutModel.generateContent(prompt);
        const response = await result.response;
        const workoutPlan = response.text();

        // Format and display workout plan
        const formattedPlan = workoutPlan
            .split('\n')
            .map(line => {
                if (line.trim().startsWith('-') || line.trim().match(/^\d+\./)) {
                    return `<li>${line.trim().replace(/^[-•\d+\.\s]+/, '')}</li>`;
                } else if (line.trim().toUpperCase() === line.trim() && line.trim().length > 0) {
                    return `<h3>${line.trim()}</h3>`;
                } else if (line.trim().length > 0) {
                    return `<p>${line.trim()}</p>`;
                }
                return '';
            })
            .join('');

        workoutResult.innerHTML = `
            <div class="workout-plan">
                <h2>Your ${workoutType} Workout Plan</h2>
                <div class="plan-details">
                    <p><strong>Fitness Level:</strong> ${fitnessLevel}</p>
                    <p><strong>Duration:</strong> ${duration} minutes</p>
                </div>
                <div class="plan-content">
                    ${formattedPlan}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Workout Plan Error:', error);
        let errorMsg = 'Sorry, there was an error generating your workout plan. Please try again.';
        if (error.message.includes('429')) {
            errorMsg = 'System is busy (Quota Exceeded). Please wait 60 seconds and try again.';
        }
        workoutResult.innerHTML = `<p class="error">${errorMsg}</p>`;
    }
});