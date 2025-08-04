import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config here
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  api_key: process.env.CLOUDINARY_API_KEY ?? '',
  api_secret: process.env.CLOUDINARY_API_SECRET ?? '',
  secure: true,
});

// Promise-based wrapper for upload_stream
export function uploadStream(buffer: Buffer, folder = 'products'): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    );
    stream.end(buffer);
  });
}

// Also export cloudinary instance if needed
export { cloudinary };
