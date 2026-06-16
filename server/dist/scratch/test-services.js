import { v2 as cloudinary } from 'cloudinary';
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
// Setup Cloudinary
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (cloudinaryUrl) {
    const matches = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (matches) {
        cloudinary.config({
            api_key: matches[1],
            api_secret: matches[2],
            cloud_name: matches[3]
        });
    }
}
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_CLOUD_API_KEY,
});
async function main() {
    // 1. Test Cloudinary
    try {
        console.log("Testing Cloudinary upload...");
        const result = await cloudinary.uploader.upload("https://picsum.photos/200", {
            resource_type: "image"
        });
        console.log("Cloudinary Upload Success:", result.secure_url);
    }
    catch (err) {
        console.error("Cloudinary Upload Failed:", err);
    }
    // 2. Test Gemini model
    try {
        console.log("Testing Gemini gemini-3-pro-image-preview...");
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: [{ text: "Hello" }],
            config: {
                maxOutputTokens: 100,
                responseModalities: ['IMAGE'],
                imageConfig: {
                    aspectRatio: '9:16',
                    imageSize: '!K'
                }
            }
        });
        console.log("Gemini Success:", response);
    }
    catch (err) {
        console.error("Gemini Failed. Status:", err.status, "Message:", err.message);
        console.error(err);
    }
}
main();
