import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_CLOUD_API_KEY,
});

async function main() {
    try {
        console.log("Using API Key:", process.env.GOOGLE_CLOUD_API_KEY);
        console.log("Testing generation with gemini-2.5-flash...");
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Hello, tell me a short joke."
        });
        console.log("gemini-2.5-flash success! Response:", response.text);

        console.log("Testing generation with gemini-3-pro-image-preview...");
        const response2 = await ai.models.generateContent({
            model: "gemini-3-pro-image-preview",
            contents: "Hello"
        });
        console.log("gemini-3-pro-image-preview success! Response:", response2);
    } catch (error: any) {
        console.error("AI API Error:");
        if (error.status) {
            console.error("Status Code:", error.status);
        }
        console.error(error);
    }
}

main();
