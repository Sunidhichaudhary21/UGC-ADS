import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_CLOUD_API_KEY,
});
async function main() {
    try {
        console.log("Fetching response...");
        const response = await ai.models.list();
        console.log("Iterating models...");
        for await (const m of response) {
            const name = m.name?.toLowerCase() || '';
            if (name.includes("image") || name.includes("imagen") || name.includes("flash") || name.includes("pro")) {
                console.log(`- ${m.name} (${m.displayName}) - Actions: ${JSON.stringify(m.supportedActions)}`);
            }
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
}
main();
