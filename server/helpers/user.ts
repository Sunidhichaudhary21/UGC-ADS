import { prisma } from '../configs/prisma.js';
import { clerkClient } from '@clerk/express';

export const getOrCreateUser = async (userId: string) => {
    let user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        try {
            const clerkUser = await clerkClient.users.getUser(userId);
            user = await prisma.user.create({
                data: {
                    id: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || '',
                    name: (clerkUser.firstName || '') + ' ' + (clerkUser.lastName || ''),
                    image: clerkUser.imageUrl || '',
                    credits: 20
                }
            });
        } catch (error) {
            console.error("Error auto-creating user from Clerk:", error);
            // Fallback user creation if Clerk API/SDK fails or isn't fully configured
            user = await prisma.user.create({
                data: {
                    id: userId,
                    email: 'unknown@example.com',
                    name: 'New User',
                    image: '',
                    credits: 20
                }
            });
        }
    } else if (user.credits === 0) {
        // If the user already exists but has 0 credits (due to previous migration default 0),
        // let's give them the 20 free credits if they haven't made any projects yet.
        const projectCount = await prisma.project.count({
            where: { userId }
        });
        if (projectCount === 0) {
            user = await prisma.user.update({
                where: { id: userId },
                data: { credits: 20 }
            });
        }
    }

    return user;
};
