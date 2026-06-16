import { prisma } from '../configs/prisma.js';
async function main() {
    try {
        console.log("Trying to insert project...");
        const project = await prisma.project.create({
            data: {
                name: "Test Project",
                userId: "user_3CWA3g4GBrab8oErdbbFNjLjTqn",
                productName: "Test Product",
                productDescription: "Test Description",
                userPrompt: "Test Prompt",
                aspectRatio: "9:16",
                targetLength: 5,
                // Let's see if uploadedImages is the correct field
                uploadedImages: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
                isGenerating: false
            }
        });
        console.log("Successfully inserted project:", project);
        // Delete the test project afterwards
        await prisma.project.delete({
            where: { id: project.id }
        });
        console.log("Successfully cleaned up test project.");
    }
    catch (error) {
        console.error("Prisma insertion error:", error);
    }
}
main();
