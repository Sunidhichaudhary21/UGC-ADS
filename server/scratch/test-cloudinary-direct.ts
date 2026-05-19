import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dnuucbhwa',
    api_key: '448247935292231',
    api_secret: 'AGJ7USkkALHvZ4Q7LErHZHOXSk8'
});

async function main() {
    try {
        console.log("Ping alternative Cloudinary...");
        const result = await cloudinary.uploader.upload("https://picsum.photos/200", {
            resource_type: "image"
        });
        console.log("Upload Success! URL:", result.secure_url);
    } catch (err: any) {
        console.error("Direct Upload Failed:", err);
    }
}

main();
