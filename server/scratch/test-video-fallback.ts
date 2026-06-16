import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";

cloudinary.config({
    cloud_name: 'dnuucbhwa',
    api_key: '448247935292231',
    api_secret: 'AGJ7USkkALHvZ4Q7LErHZHOXSk8'
});

async function main() {
    const fallbackUrls = [
        'https://res.cloudinary.com/demo/video/upload/forest_bike.mp4',
        'https://github.com/intel-iot-devkit/sample-videos/raw/master/face-demographics-walking-and-pause.mp4',
        'https://github.com/intel-iot-devkit/sample-videos/raw/master/bottle-detection.mp4'
    ];

    for (const url of fallbackUrls) {
        try {
            console.log("Testing upload of fallback video:", url);
            const result = await cloudinary.uploader.upload(url, {
                resource_type: "video"
            });
            console.log("Video Upload Success! URL:", result.secure_url);
        } catch (err: any) {
            console.error(`Video Upload Failed for ${url}:`, err.message || err);
        }
    }
}

main();
