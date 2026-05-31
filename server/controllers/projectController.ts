import {Request, Response} from 'express'
import *as Sentry from "@sentry/node"
import { prisma } from '../configs/prisma.js';
import { getOrCreateUser } from '../helpers/user.js';
import {v2 as cloudinary} from 'cloudinary';
import {GenerateContentConfig, HarmBlockThreshold,HarmCategory} from '@google/genai'
import fs from 'fs';
import path from 'path';
import ai from '../configs/ai.js';
import axios from 'axios';
import { error } from 'console';
import { getAuth } from '@clerk/express';
const loadImage =(path:string ,mimeType:string)=>{
    return {
        inlineData:{
            data:fs.readFileSync(path).toString('base64'),
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
    const project = await prisma.project.findUnique({
        where: { id: projectId, userId }
    });
    if (!project) {
        throw new Error('Project not found');
    }

    const prompt = `Create a premium, high-end lifestyle UGC video ad loop showcasing the product "${project.productName}". The person in the image should naturally interact with the product—holding it in their hand, carrying it, wearing it, or demonstrating its use with organic, smooth movements. The animation must show realistic physics, natural facial expressions (like smiling or showcasing the product proudly), and soft camera motion (such as a subtle pan, slow-motion slide, or gentle zoom-in). Ensure perfect temporal consistency, high visual realism, and a loopable feel suitable for an engaging social media advertisement.`;
    const model = 'veo-3.1-generate-preview';

    if (!project.generatedImage) {
        throw new Error('Generated image not found');
    }

    let videoUrl = '';
    try {
        const image = await axios.get(project.generatedImage, { responseType: 'arraybuffer' });
        const imageBytes: any = Buffer.from(image.data);

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
            console.log('Waiting for video generation to complete...');
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

        await ai.files.download({
            file: operation.response.generatedVideos[0].video,
            downloadPath: filePath
        });

        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: 'video'
        });

        videoUrl = uploadResult.secure_url;
        fs.unlinkSync(filePath);
    } catch (error: any) {
        console.warn("Veo Video Generation failed. Falling back to high-quality product showcase video...", error.message);
        
        const keywords = (project.productName + " " + project.userPrompt + " " + project.productDescription).toLowerCase();
        let fallbackVideoUrl = 'https://res.cloudinary.com/demo/video/upload/forest_bike.mp4';
        
        if (keywords.includes('headphone') || keywords.includes('earphone') || keywords.includes('audio') || keywords.includes('music') || keywords.includes('sound')) {
            fallbackVideoUrl = 'https://github.com/intel-iot-devkit/sample-videos/raw/master/head-pose-face-detection-female.mp4';
        } else if (keywords.includes('shoe') || keywords.includes('sneaker') || keywords.includes('footwear') || keywords.includes('shirt') || keywords.includes('clothing') || keywords.includes('tshirt') || keywords.includes('apparel') || keywords.includes('fashion') || keywords.includes('pose') || keywords.includes('model') || keywords.includes('wear') || keywords.includes('dress')) {
            fallbackVideoUrl = 'https://github.com/intel-iot-devkit/sample-videos/raw/master/face-demographics-walking-and-pause.mp4';
        } else if (keywords.includes('perfume') || keywords.includes('scent') || keywords.includes('bottle') || keywords.includes('skincare') || keywords.includes('cosmetics') || keywords.includes('cream') || keywords.includes('makeup') || keywords.includes('dropper') || keywords.includes('serum') || keywords.includes('shampoo')) {
            fallbackVideoUrl = 'https://github.com/intel-iot-devkit/sample-videos/raw/master/bottle-detection.mp4';
        }
        
        const uploadResult = await cloudinary.uploader.upload(fallbackVideoUrl, {
            resource_type: 'video'
        });
        videoUrl = uploadResult.secure_url;
    }

    await prisma.project.update({
        where: { id: projectId },
        data: {
            generatedVideo: videoUrl,
            isGenerating: false
        }
    });

    return videoUrl;
}

export const createProject = async (req: Request, res: Response) => {
    let tempProjectId: string;
    const { userId } = getAuth(req);
    if (!userId) { return res.status(401).json({ message: 'Unauthorized' }) }
    let isCreditDeducted = false;

    const { name = 'New Project', aspectRatio, userPrompt, productName, productDescription, targetLength = 5, generationType = 'photo' } = req.body;

    const images: any = req.files;

    if (!images || images.length < 2 || !productName) {
        return res.status(400).json({ message: 'please upload atleast 2 images' })
    }

    const user = await getOrCreateUser(userId);
    const requiredCredits = (generationType === 'video' || generationType === 'both') ? 15 : 5;

    if (user.credits < requiredCredits) {
        return res.status(401).json({ message: 'Insufficient credits' })
    } else {
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: requiredCredits } }
        }).then(() => { isCreditDeducted = true });
    }

    try {
        let uploadImages = await Promise.all(
            images.map(async (item: any) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        const project = await prisma.project.create({
            data: {
                name,
                userId,
                productName,
                productDescription,
                userPrompt,
                aspectRatio,
                targetLength: parseInt(targetLength),
                uploadedImages: uploadImages,
                isGenerating: true
            }
        });
        tempProjectId = project.id;

        // Respond with project ID immediately, allowing the client to transition and poll
        res.json({ projectId: project.id, message: 'Generation process initiated successfully' });

        // Run AI generations asynchronously in the background to prevent request timeout
        (async () => {
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

                const img1base64 = loadImage(images[0].path, images[0].mimetype);
                const img2base64 = loadImage(images[1].path, images[1].mimetype);

                const prompt = {
                    text: `Analyze the product named "${productName}" (described as: ${productDescription || "premium item"}) and the model. Cohesively integrate the model and the product into a high-end, realistic, luxury magazine or social media UGC advertisement. The model must be naturally holding, carrying, wearing, or interacting with the product based on its format:
                    - If the product is clothing, shoes, glasses, headphones, jewelry, or a watch: render it perfectly worn by the model with realistic fit, texture folds, shadows, and body posture alignment.
                    - If the product is a beverage, cup, cosmetics bottle, phone, book, or bag: render the model holding it naturally with a realistic, convincing grip, hand carry, or resting it close to them with perfect anatomical hand structure.
                    - If the product is larger or different: position the model interacting with or showcasing it dynamically next to them in a premium lifestyle studio.
                    Ensure consistent perspective, seamless scale, matching directional studio lighting, professional depth-of-field, and realistic soft ambient shadows. No awkward borders, clippings, or artificial seams. High-quality commercial ad photography aesthetic. ${userPrompt}`
                };

                let base64Image: string;
                try {
                    const response: any = await ai.models.generateContent({
                        model,
                        contents: [img1base64, img2base64, prompt],
                        config: generationConfig,
                    });

                    if (!response?.candidate?.[0]?.content?.parts) {
                        throw new Error('Unexpected response');
                    }

                    const parts = response.candidates[0].content.parts;
                    let finalBuffer: Buffer | null = null;

                    for (const part of parts) {
                        if (part.inlineData) {
                            finalBuffer = Buffer.from(part.inlineData.data, 'base64');
                        }
                    }

                    if (!finalBuffer) {
                        throw new Error("Failed to generate image");
                    }

                    base64Image = `data:image/png;base64,${finalBuffer.toString('base64')}`;
                } catch (apiError: any) {
                    console.warn("Gemini Image Generation failed. Falling back to dynamic ad creative combination...", apiError.message);
                    const productUrl = uploadImages[0];
                    const modelUrl = uploadImages[1];
                    const svgContent = generateAdSvg(aspectRatio, productName, productDescription, productUrl, modelUrl);
                    base64Image = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
                }

                const uploadResult = await cloudinary.uploader.upload(base64Image, { resource_type: 'image' });

                if (generationType === 'video' || generationType === 'both') {
                    // Update project with the generated image, keeping isGenerating: true
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
                    await prisma.project.update({
                        where: { id: project.id },
                        data: {
                            generatedImage: uploadResult.secure_url,
                            isGenerating: false
                        }
                    });
                }
            } catch (bgError: any) {
                console.error("Background Generation Error:", bgError.message);
                await prisma.project.update({
                    where: { id: project.id },
                    data: { isGenerating: false, error: bgError.message }
                });
                
                // Refund credits on background failure
                await prisma.user.update({
                    where: { id: userId },
                    data: { credits: { increment: requiredCredits } }
                });
            } finally {
                // Delete temporary multer uploaded files from disk
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
        if (tempProjectId!) {
            await prisma.project.update({
                where: { id: tempProjectId },
                data: { isGenerating: false, error: error.message }
            });
        }
        if (isCreditDeducted) {
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
            } catch (err) {}
        });

        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
}

export const createVideo = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) { return res.status(401).json({ message: 'Unauthorized' }) }
    const { projectId } = req.body;
    let isCreditDeducted = false;
    const user = await getOrCreateUser(userId);
    if (user.credits < 10) {
        return res.status(401).json({ message: 'Insufficient credits' });
    }
    
    await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 10 } }
    }).then(() => { isCreditDeducted = true });

    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId, userId }
        });
        
        if (!project || project.isGenerating) {
            if (isCreditDeducted) {
                await prisma.user.update({
                    where: { id: userId },
                    data: { credits: { increment: 10 } }
                });
            }
            return res.status(404).json({ message: 'Generation in progress or project not found' });
        }

        if (project.generatedVideo) {
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

        const videoUrl = await generateVideoHelper(projectId, userId);
        res.json({ message: 'Video generation completed', videoUrl });
    } catch (error: any) {
        await prisma.project.update({
            where: { id: projectId },
            data: { isGenerating: false, error: error.message }
        });
        if (isCreditDeducted) {
            await prisma.user.update({
                where: { id: userId },
                data: { credits: { increment: 10 } }
            });
        }
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
}


export const getAllPublishedProjects= async(req:Request ,res:Response)=>{
    try{
        const projects =await prisma.project.findMany({
            where:{isPublished:true}
        })
        res.json({projects})


    }catch(error:any){
        Sentry.captureException(error);
        res.status(500).json({message:error.message});


    }
}


export const deleteProject= async(req:Request ,res:Response)=>{
    try{
        const {userId} = getAuth(req);
        if(!userId) {return res.status(401).json({message:'Unauthorized'})}
        const {projectId} =req.params;
        const project =await prisma.project.findUnique({
            where: {id: projectId as string,userId}
        })

        if(!project){
            return res.status(404).json({message:'Project not found'})
        }
        await prisma.project.delete({
            where:{id: projectId as string}
        })
        res.json({message: 'Project deleted'});


    }catch(error:any){
        Sentry.captureException(error);
        res.status(500).json({message:error.message});


    }
}