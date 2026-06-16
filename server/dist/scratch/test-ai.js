import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_CLOUD_API_KEY,
});
async function main() {
    // Test gemini-2.5-flash-image
    try {
        console.log("Testing generation with gemini-2.5-flash-image...");
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: "A cinematic shot of a cute golden retriever playing in grass",
            config: {
                responseModalities: ["IMAGE"]
            }
        });
        console.log("gemini-2.5-flash-image success! Response:", response.candidates?.[0]?.content?.parts?.[0]?.inlineData ? "Contains image data!" : "No image data");
    }
    catch (error) {
        console.error("gemini-2.5-flash-image failed:", error.message);
    }
    // Test gemini-3.1-flash-image
    try {
        console.log("Testing generation with gemini-3.1-flash-image...");
        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-image",
            contents: "A cinematic shot of a cute golden retriever playing in grass",
            config: {
                responseModalities: ["IMAGE"]
            }
        });
        console.log("gemini-3.1-flash-image success! Response:", response.candidates?.[0]?.content?.parts?.[0]?.inlineData ? "Contains image data!" : "No image data");
    }
    catch (error) {
        console.error("gemini-3.1-flash-image failed:", error.message);
    }
}
main();
