import { Request, Response } from 'express'
import *as Sentry from "@sentry/node"
import { prisma } from '../configs/prisma.js';
import { getOrCreateUser } from '../helpers/user.js';
import { v2 as cloudinary } from 'cloudinary';
import { GenerateContentConfig, HarmBlockThreshold, HarmCategory } from '@google/genai'
import fs from 'fs';
import path from 'path';
import ai from '../configs/ai.js';
import axios from 'axios';
import { error } from 'console';
import { getAuth } from '@clerk/express';
const loadImage = (path: string, mimeType: string) => {
    return {
        inlineData: {
            data: fs.readFileSync(path).toString('base64'),
            mimeType

        }
    }

}

function generateAdSvg(aspectRatio: string, productName: string, productDescription: string, productUrl: string, modelUrl: string): string {
    const isVertical = aspectRatio === "9:16";
    const width = isVertical ? 1080 : 1920;
    const height = isVertical ? 1920 : 1080;

    if (isVertical) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
            <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#070a13" />
                    <stop offset="50%" stop-color="#0f172a" />
                    <stop offset="100%" stop-color="#1e1b4b" />
                </linearGradient>
                <clipPath id="circleClip">
                    <circle cx="540" cy="720" r="380" />
                </clipPath>
                <clipPath id="rectClip">
                    <rect x="520" y="980" width="420" height="420" rx="50" />
                </clipPath>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#6366f1" flood-opacity="0.5"/>
                </filter>
                <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#000000" flood-opacity="0.7"/>
                </filter>
            </defs>

            <!-- Background -->
            <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
            
            <!-- Grid lines decoration -->
            <path d="M 0 320 L 1080 320 M 0 640 L 1080 640 M 0 960 L 1080 960 M 0 1280 L 1080 1280 M 0 1600 L 1080 1600" stroke="white" stroke-opacity="0.04" stroke-width="2" />
            <path d="M 270 0 L 270 1920 M 540 0 L 540 1920 M 810 0 L 810 1920" stroke="white" stroke-opacity="0.04" stroke-width="2" />

            <!-- Brand Badge -->
            <g transform="translate(540, 140)">
                <rect x="-180" y="-30" width="360" height="60" rx="30" fill="white" fill-opacity="0.05" stroke="white" stroke-opacity="0.15" stroke-width="1.5" />
                <circle cx="-130" cy="0" r="10" fill="#6366f1" />
                <text x="-105" y="7" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" fill="#a5b4fc" letter-spacing="4">UGC AD CREATIVE</text>
            </g>

            <!-- Model Image -->
            <g filter="url(#shadow)">
                <circle cx="540" cy="720" r="385" fill="none" stroke="#6366f1" stroke-width="6" stroke-opacity="0.5" />
                <g clip-path="url(#circleClip)">
                    <image href="${modelUrl}" xlink:href="${modelUrl}" x="160" y="340" width="760" height="760" preserveAspectRatio="xMidYMid slice" />
                </g>
                <rect x="390" y="1060" width="300" height="50" rx="25" fill="#6366f1" />
                <text x="540" y="1092" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" fill="white" text-anchor="middle" letter-spacing="2">UGC CREATIVE</text>
            </g>

            <!-- Floating Product Image Overlay -->
            <g filter="url(#glow)">
                <rect x="516" y="976" width="428" height="428" rx="54" fill="none" stroke="#a855f7" stroke-width="6" />
                <g clip-path="url(#rectClip)">
                    <image href="${productUrl}" xlink:href="${productUrl}" x="520" y="980" width="420" height="420" preserveAspectRatio="xMidYMid slice" />
                </g>
                <rect x="560" y="1000" width="160" height="44" rx="22" fill="#a855f7" />
                <text x="640" y="1027" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="white" text-anchor="middle" letter-spacing="2">PRODUCT</text>
            </g>

            <!-- Bottom Ad Messaging & CTA -->
            <g transform="translate(540, 1540)">
                <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="900" fill="white" text-anchor="middle" letter-spacing="-1">${productName.toUpperCase()}</text>
                
                <text x="0" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="500" fill="#94a3b8" text-anchor="middle">
                    ${productDescription ? (productDescription.length > 55 ? productDescription.substring(0, 52) + '...' : productDescription) : 'Best-in-class product experience.'}
                </text>

                <!-- CTA Button -->
                <g transform="translate(0, 160)">
                    <rect x="-240" y="-45" width="480" height="90" rx="45" fill="#6366f1" filter="url(#glow)" />
                    <text x="0" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="900" fill="white" text-anchor="middle" letter-spacing="4">ORDER NOW - 50% OFF</text>
                </g>
            </g>
        </svg>
        `;
    } else {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
            <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#070a13" />
                    <stop offset="50%" stop-color="#0f172a" />
                    <stop offset="100%" stop-color="#1e1b4b" />
                </linearGradient>
                <clipPath id="modelClip">
                    <rect x="100" y="200" width="700" height="700" rx="60" />
                </clipPath>
                <clipPath id="productClip">
                    <rect x="1120" y="200" width="700" height="700" rx="60" />
                </clipPath>
                <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="15" stdDeviation="25" flood-color="#000000" flood-opacity="0.6"/>
                </filter>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#6366f1" flood-opacity="0.4"/>
                </filter>
            </defs>

            <!-- Background -->
            <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

            <!-- Grid lines -->
            <path d="M 0 180 L 1920 180 M 0 540 L 1920 540 M 0 900 L 1920 900" stroke="white" stroke-opacity="0.02" stroke-width="2" />
            <path d="M 480 0 L 480 1080 M 960 0 L 960 1080 M 1440 0 L 1440 1080" stroke="white" stroke-opacity="0.02" stroke-width="2" />

            <!-- Brand Badge -->
            <g transform="translate(960, 100)">
                <rect x="-180" y="-25" width="360" height="50" rx="25" fill="white" fill-opacity="0.05" stroke="white" stroke-opacity="0.15" stroke-width="1.5" />
                <circle cx="-130" cy="0" r="8" fill="#a855f7" />
                <text x="-105" y="6" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="#c084fc" letter-spacing="3">UGC AD PLATFORM</text>
            </g>

            <!-- Model (Left) -->
            <g filter="url(#shadow)">
                <rect x="96" y="196" width="708" height="708" rx="64" fill="none" stroke="#6366f1" stroke-width="4" stroke-opacity="0.4" />
                <g clip-path="url(#modelClip)">
                    <image href="${modelUrl}" xlink:href="${modelUrl}" x="100" y="200" width="700" height="700" preserveAspectRatio="xMidYMid slice" />
                </g>
                <rect x="140" y="230" width="180" height="44" rx="22" fill="#6366f1" />
                <text x="230" y="257" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="white" text-anchor="middle" letter-spacing="1">UGC MODEL</text>
            </g>

            <!-- Product (Right) -->
            <g filter="url(#glow)">
                <rect x="1116" y="196" width="708" height="708" rx="64" fill="none" stroke="#a855f7" stroke-width="4" stroke-opacity="0.4" />
                <g clip-path="url(#productClip)">
                    <image href="${productUrl}" xlink:href="${productUrl}" x="1120" y="200" width="700" height="700" preserveAspectRatio="xMidYMid slice" />
                </g>
                <rect x="1160" y="230" width="180" height="44" rx="22" fill="#a855f7" />
                <text x="1250" y="257" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="white" text-anchor="middle" letter-spacing="1">YOUR PRODUCT</text>
            </g>

            <!-- Glassmorphic Card (Center) -->
            <g transform="translate(960, 540)" filter="url(#shadow)">
                <rect x="-240" y="-180" width="480" height="360" rx="40" fill="#0f172a" fill-opacity="0.8" stroke="white" stroke-opacity="0.15" stroke-width="2" />
                <text x="0" y="-100" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="#a5b4fc" text-anchor="middle" letter-spacing="4">EXCLUSIVELY CREATED</text>
                <text x="0" y="-30" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" fill="white" text-anchor="middle" letter-spacing="-1">${productName.toUpperCase()}</text>
                <text x="0" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="#94a3b8" text-anchor="middle">
                    ${productDescription ? (productDescription.length > 40 ? productDescription.substring(0, 37) + '...' : productDescription) : 'Best-in-class product experience.'}
                </text>
                <g transform="translate(0, 90)" cursor="pointer">
                    <rect x="-150" y="-25" width="300" height="50" rx="25" fill="#a855f7" filter="url(#glow)" />
                    <text x="0" y="6" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="white" text-anchor="middle" letter-spacing="2">ORDER NOW</text>
                </g>
            </g>
        </svg>
        `;
    }
}

async function generateVideoHelper(projectId: string, userId: string): Promise<string> {
    console.log(`[Video Gen] Starting video generation helper for project: ${projectId}, user: ${userId}`);
    const project = await prisma.project.findUnique({
        where: { id: projectId, userId }
    });
    if (!project) {
        console.error(`[Video Gen] Project not found for id: ${projectId}`);
        throw new Error('Project not found');
    }

    const prompt = `Create a premium, high-end lifestyle UGC video ad loop showcasing the product "${project.productName}". The person in the image should naturally interact with the product—holding it in their hand, carrying it, wearing it, or demonstrating its use with organic, smooth movements. The animation must show realistic physics, natural facial expressions (like smiling or showcasing the product proudly), and soft camera motion (such as a subtle pan, slow-motion slide, or gentle zoom-in). Ensure perfect temporal consistency, high visual realism, and a loopable feel suitable for an engaging social media advertisement.`;
    const model = 'veo-3.1-generate-preview';

    if (!project.generatedImage) {
        console.error(`[Video Gen] Generated image missing for project: ${projectId}`);
        throw new Error('Generated image not found');
    }

    let videoUrl = '';
    try {
        console.log(`[Video Gen] Downloading generated image for video reference: ${project.generatedImage}`);
        const image = await axios.get(project.generatedImage, { responseType: 'arraybuffer' });
        const imageBytes: any = Buffer.from(image.data);

        console.log(`[Video Gen] Initiating generateVideos call via Gemini (Veo model: ${model})...`);
        let operation: any = await ai.models.generateVideos({
            model,
            prompt,
            image: {
                imageBytes: imageBytes.toString('base64'),
                mimeType: 'image/png',
            },
            config: {
                aspectRatio: project?.aspectRatio || '9:16',
                numberOfVideos: 1,
                resolution: '720p',
            }
        });

        while (!operation.done) {
            console.log('[Video Gen] Waiting for video generation to complete...');
            await new Promise((resolve) => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({
                operation: operation,
            });
        }

        const filename = `${userId}-${Date.now()}.mp4`;
        const filePath = path.join('videos', filename);
        fs.mkdirSync('videos', { recursive: true });

        if (!operation.response.generatedVideo) {
            throw new Error(operation.response.raiMediaFilteredReasons?.[0] || 'Veo response did not contain video');
        }

        console.log(`[Video Gen] Video generated. Downloading to: ${filePath}`);
        await ai.files.download({
            file: operation.response.generatedVideos[0].video,
            downloadPath: filePath
        });

        console.log(`[Video Gen] Uploading generated video to Cloudinary...`);
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: 'video'
        });

        videoUrl = uploadResult.secure_url;
        console.log(`[Video Gen] Uploaded successfully: ${videoUrl}`);
        fs.unlinkSync(filePath);
    } catch (error: any) {
        console.warn(`[Video Gen] Veo Video Generation failed (${error.message}). Falling back to generic template video...`);

        const keywords = (project.productName + " " + project.userPrompt + " " + project.productDescription).toLowerCase();
        let fallbackVideoUrl = 'https://github.com/intel-iot-devkit/sample-videos/raw/master/face-demographics-walking-and-pause.mp4';

        if (keywords.includes('headphone') || keywords.includes('earphone') || keywords.includes('audio') || keywords.includes('music') || keywords.includes('sound')) {
            fallbackVideoUrl = 'https://github.com/intel-iot-devkit/sample-videos/raw/master/head-pose-face-detection-female.mp4';
        } else if (keywords.includes('shoe') || keywords.includes('sneaker') || keywords.includes('footwear') || keywords.includes('shirt') || keywords.includes('clothing') || keywords.includes('tshirt') || keywords.includes('apparel') || keywords.includes('fashion') || keywords.includes('pose') || keywords.includes('model') || keywords.includes('wear') || keywords.includes('dress')) {
            fallbackVideoUrl = 'https://github.com/intel-iot-devkit/sample-videos/raw/master/face-demographics-walking-and-pause.mp4';
        } else if (keywords.includes('perfume') || keywords.includes('scent') || keywords.includes('bottle') || keywords.includes('skincare') || keywords.includes('cosmetics') || keywords.includes('cream') || keywords.includes('makeup') || keywords.includes('dropper') || keywords.includes('serum') || keywords.includes('shampoo')) {
            fallbackVideoUrl = 'https://github.com/intel-iot-devkit/sample-videos/raw/master/bottle-detection.mp4';
        }

        console.log(`[Video Gen] Uploading fallback video URL to Cloudinary: ${fallbackVideoUrl}`);
        const uploadResult = await cloudinary.uploader.upload(fallbackVideoUrl, {
            resource_type: 'video'
        });
        videoUrl = uploadResult.secure_url;
        console.log(`[Video Gen] Fallback video uploaded successfully: ${videoUrl}`);
    }

    console.log(`[Video Gen] Updating database record with generated video url...`);
    await prisma.project.update({
        where: { id: projectId },
        data: {
            generatedVideo: videoUrl,
            isGenerating: false
        }
    });

    console.log(`[Video Gen] Video helper successfully completed for project: ${projectId}`);
    return videoUrl;
}

export const createProject = async (req: Request, res: Response) => {
    let tempProjectId: string;
    const { userId } = getAuth(req);
    if (!userId) {
        console.error("[Create Project] Unauthorized request");
        return res.status(401).json({ message: 'Unauthorized' })
    }
    let isCreditDeducted = false;

    let { name, aspectRatio = '9:16', userPrompt = '', productName = '', productDescription = '', targetLength = 5, generationType = 'both' } = req.body;
    if (!generationType) {
        generationType = 'both';
    }

    console.log(`[Create Project] User ${userId} initiated campaign creation. Body:`, { name, aspectRatio, productName, productDescription, generationType });

    const images: any = req.files;

    if (!images || images.length < 2) {
        console.error("[Create Project] Insufficient images uploaded. Expected at least 2.");
        return res.status(400).json({ message: 'please upload atleast 2 images' })
    }

    const img1base64 = loadImage(images[0].path, images[0].mimetype);
    const img2base64 = loadImage(images[1].path, images[1].mimetype);

    // Auto-detect product name and description if not provided
    let detectedProductName = productName || '';
    let detectedProductDescription = productDescription || '';

    if (!detectedProductName) {
        console.log("[Create Project] Product name missing. Auto-detecting details from image via Gemini 2.5 Flash...");
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    img1base64,
                    'Analyze this product image. Return a JSON object containing "productName" (a catchy, professional brand/product name, max 3 words) and "productDescription" (a concise, premium marketing tagline, max 10 words). Use this format: {"productName": "Product Name", "productDescription": "Product Description"}'
                ],
                config: {
                    responseMimeType: "application/json"
                }
            });
            const text = response.text?.trim();
            if (text) {
                console.log(`[Create Project] Gemini response text: ${text}`);
                const parsed = JSON.parse(text);
                if (parsed.productName) detectedProductName = parsed.productName;
                if (parsed.productDescription) detectedProductDescription = parsed.productDescription;
            }
        } catch (err: any) {
            console.error("[Create Project] Error auto-detecting product info:", err.message || err);
        }
    }

    if (!detectedProductName) {
        detectedProductName = "Premium Product";
    }
    if (!detectedProductDescription) {
        detectedProductDescription = "High-quality lifestyle product.";
    }

    console.log(`[Create Project] Final product details: Name = "${detectedProductName}", Description = "${detectedProductDescription}"`);

    const finalProjectName = name || `UGC Ad - ${detectedProductName}`;

    const user = await getOrCreateUser(userId);
    const requiredCredits = (generationType === 'video' || generationType === 'both') ? 15 : 5;

    console.log(`[Create Project] Checking credits for user ${userId}. Available: ${user.credits}, Required: ${requiredCredits}`);
    if (user.credits < requiredCredits) {
        console.error(`[Create Project] Insufficient credits for user ${userId}. Available: ${user.credits}`);
        return res.status(401).json({ message: 'Insufficient credits' })
    } else {
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: requiredCredits } }
        }).then(() => {
            isCreditDeducted = true;
            console.log(`[Create Project] Deducted ${requiredCredits} credits. User now has ${user.credits - requiredCredits} credits.`);
        });
    }

    try {
        console.log(`[Create Project] Uploading uploaded images to Cloudinary...`);
        let uploadImages = await Promise.all(
            images.map(async (item: any) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );
        console.log(`[Create Project] Cloudinary upload successful:`, uploadImages);

        console.log(`[Create Project] Saving campaign project to database...`);
        const project = await prisma.project.create({
            data: {
                name: finalProjectName,
                userId,
                productName: detectedProductName,
                productDescription: detectedProductDescription,
                userPrompt,
                aspectRatio,
                targetLength: parseInt(targetLength),
                uploadedImages: uploadImages,
                isGenerating: true
            }
        });
        tempProjectId = project.id;
        console.log(`[Create Project] Project saved successfully with ID: ${project.id}`);

        // Respond with project ID immediately, allowing the client to transition and poll
        res.json({ projectId: project.id, message: 'Generation process initiated successfully' });

        // Run AI generations asynchronously in the background to prevent request timeout
        (async () => {
            console.log(`[Background Worker] Starting generation workflow for project: ${project.id}`);
            try {
                const model = 'gemini-3-pro-image-preview';
                const generationConfig: GenerateContentConfig = {
                    maxOutputTokens: 32768,
                    temperature: 1,
                    topP: 0.95,
                    responseModalities: ['IMAGE'],
                    imageConfig: {
                        aspectRatio: aspectRatio || '9:16',
                        imageSize: '!K'
                    },
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
                    ]
                };

                const generationPrompt = {
                    text: `You are given two images:
1. Product Image: This image contains the specific product named "${detectedProductName}".
2. Model Image: This image contains the person (model) who should showcase the product.

Your task is to cohesively integrate the model (the person from the Model Image) and the product (from the Product Image) into a single, high-end, realistic, luxury magazine or social media UGC (User Generated Content) advertisement showcasing the product.

Instructions:
1. Identify the product from the Product Image and the model (person) from the Model Image.
2. Render the model naturally holding, carrying, wearing, or interacting with the product based on its format:
   - If the product is clothing, shoes, glasses, headphones, jewelry, or a watch: render the product perfectly worn by the model with realistic fit, texture folds, shadows, and body posture alignment.
   - If the product is a beverage, cup, cosmetics bottle, phone, book, or bag: render the model holding the product naturally with a realistic, convincing grip, hand carry, or resting the product close to them with perfect anatomical hand structure (5 fingers, natural grip).
   - If the product is larger or different: position the model interacting with or showcasing the product dynamically next to them in a premium lifestyle setting.
3. Keep the model's facial features and appearance consistent with the Model Image.
4. Keep the product's design, colors, branding, and details consistent with the Product Image.
5. Merge the two seamlessly: ensure consistent perspective, seamless scale, matching directional studio lighting, professional depth-of-field, and realistic soft ambient shadows. There must be no awkward borders, clippings, or artificial seams.
6. The output must be a high-quality, professional commercial advertisement photography aesthetic.
7. Avoid adding generic template elements or text overlays on the image itself.

Product Name: ${detectedProductName}
Product Description: ${detectedProductDescription}

Additional user guidelines: ${userPrompt || "Focus on a clean, premium commercial aesthetic."}`
                };

                let base64Image: string;
                try {
                    console.log(`[Background Worker] Calling Gemini generateContent for image gen (${model})...`);
                    const response: any = await ai.models.generateContent({
                        model,
                        contents: [
                            { text: "Product Image:" },
                            img1base64,
                            { text: "Model Image:" },
                            img2base64,
                            generationPrompt
                        ],
                        config: generationConfig,
                    });

                    if (!response?.candidates?.[0]?.content?.parts) {
                        throw new Error('Unexpected response structure');
                    }

                    const parts = response.candidates[0].content.parts;
                    let finalBuffer: Buffer | null = null;

                    for (const part of parts) {
                        if (part.inlineData) {
                            finalBuffer = Buffer.from(part.inlineData.data, 'base64');
                        }
                    }

                    if (!finalBuffer) {
                        throw new Error("Failed to generate image bytes");
                    }

                    base64Image = `data:image/png;base64,${finalBuffer.toString('base64')}`;
                    console.log("[Background Worker] Gemini image generation succeeded.");
                } catch (apiError: any) {
                    console.warn(`[Background Worker] Gemini Image Generation failed (${apiError.message}). Falling back to SVG generator...`);
                    const productUrl = uploadImages[0];
                    const modelUrl = uploadImages[1];
                    const svgContent = generateAdSvg(aspectRatio, detectedProductName, detectedProductDescription, productUrl, modelUrl);
                    base64Image = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
                }

                console.log("[Background Worker] Uploading generated creative image to Cloudinary...");
                const uploadResult = await cloudinary.uploader.upload(base64Image, { resource_type: 'image' });
                console.log(`[Background Worker] Creative image uploaded successfully: ${uploadResult.secure_url}`);

                if (generationType === 'video' || generationType === 'both') {
                    // Update project with the generated image, keeping isGenerating: true
                    console.log("[Background Worker] Updating project with generated image, proceeding to video generation...");
                    await prisma.project.update({
                        where: { id: project.id },
                        data: {
                            generatedImage: uploadResult.secure_url
                        }
                    });

                    // Trigger video generation background worker
                    await generateVideoHelper(project.id, userId);
                } else {
                    // Single photo ad type completed
                    console.log("[Background Worker] Ad generation complete (photo ad type). Updating project in DB...");
                    await prisma.project.update({
                        where: { id: project.id },
                        data: {
                            generatedImage: uploadResult.secure_url,
                            isGenerating: false
                        }
                    });
                }
            } catch (bgError: any) {
                console.error("[Background Worker] Fatal error in generation workflow:", bgError.message || bgError);
                await prisma.project.update({
                    where: { id: project.id },
                    data: { isGenerating: false, error: bgError.message }
                });

                // Refund credits on background failure
                console.log(`[Background Worker] Refunding ${requiredCredits} credits to user ${userId} due to failure.`);
                await prisma.user.update({
                    where: { id: userId },
                    data: { credits: { increment: requiredCredits } }
                });
            } finally {
                // Delete temporary multer uploaded files from disk
                console.log("[Background Worker] Cleaning up temporary files...");
                images.forEach((file: any) => {
                    try {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    } catch (err: any) {
                        console.error("Failed to clean up temp file:", err.message);
                    }
                });
            }
        })();

    } catch (error: any) {
        console.error("[Create Project] Outer handler caught fatal error:", error.message || error);
        if (tempProjectId!) {
            await prisma.project.update({
                where: { id: tempProjectId },
                data: { isGenerating: false, error: error.message }
            });
        }
        if (isCreditDeducted) {
            console.log(`[Create Project] Outer refunding ${requiredCredits} credits to user ${userId}.`);
            await prisma.user.update({
                where: { id: userId },
                data: { credits: { increment: requiredCredits } }
            });
        }
        images.forEach((file: any) => {
            try {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            } catch (err) { }
        });

        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
}

export const createVideo = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
        console.error("[Create Video] Unauthorized request");
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const { projectId } = req.body;
    console.log(`[Create Video] User ${userId} requested video generation for project: ${projectId}`);
    let isCreditDeducted = false;
    const user = await getOrCreateUser(userId);
    if (user.credits < 10) {
        console.error(`[Create Video] Insufficient credits for user ${userId}. Available: ${user.credits}`);
        return res.status(401).json({ message: 'Insufficient credits' });
    }

    await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 10 } }
    }).then(() => {
        isCreditDeducted = true;
        console.log(`[Create Video] Deducted 10 credits. User now has ${user.credits - 10} credits.`);
    });

    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId, userId }
        });

        if (!project || project.isGenerating) {
            console.error(`[Create Video] Project ${projectId} is generating or not found`);
            if (isCreditDeducted) {
                await prisma.user.update({
                    where: { id: userId },
                    data: { credits: { increment: 10 } }
                });
            }
            return res.status(404).json({ message: 'Generation in progress or project not found' });
        }

        if (project.generatedVideo) {
            console.error(`[Create Video] Video already generated for project ${projectId}`);
            if (isCreditDeducted) {
                await prisma.user.update({
                    where: { id: userId },
                    data: { credits: { increment: 10 } }
                });
            }
            return res.status(400).json({ message: 'Video already generated' });
        }

        await prisma.project.update({
            where: { id: projectId },
            data: { isGenerating: true }
        });

        console.log(`[Create Video] Invoking video generation helper for project: ${projectId}`);
        const videoUrl = await generateVideoHelper(projectId, userId);
        res.json({ message: 'Video generation completed', videoUrl });
    } catch (error: any) {
        console.error(`[Create Video] Failed to generate video for project ${projectId}:`, error.message || error);
        await prisma.project.update({
            where: { id: projectId },
            data: { isGenerating: false, error: error.message }
        });
        if (isCreditDeducted) {
            console.log(`[Create Video] Refunding 10 credits to user ${userId} due to generation error.`);
            await prisma.user.update({
                where: { id: userId },
                data: { credits: { increment: 10 } }
            });
        }
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
}


export const getAllPublishedProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            where: { isPublished: true }
        })
        res.json({ projects })


    } catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });


    }
}


export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) { return res.status(401).json({ message: 'Unauthorized' }) }
        const { projectId } = req.params;
        const project = await prisma.project.findUnique({
            where: { id: projectId as string, userId }
        })

        if (!project) {
            return res.status(404).json({ message: 'Project not found' })
        }
        await prisma.project.delete({
            where: { id: projectId as string }
        })
        res.json({ message: 'Project deleted' });


    } catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });


    }
}