import { prisma } from '../configs/prisma.js';
async function main() {
    try {
        console.log("Connecting to Database...");
        const users = await prisma.user.findMany({
            take: 5
        });
        console.log("Current Users in DB:", JSON.stringify(users, null, 2));
        const projects = await prisma.project.findMany({
            take: 5
        });
        console.log("Current Projects in DB:", JSON.stringify(projects, null, 2));
    }
    catch (error) {
        console.error("Database connection error:", error);
    }
}
main();
