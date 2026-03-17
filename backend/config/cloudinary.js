import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables immediately
dotenv.config();

// --- SAFETY CHECK LOGS ---
// If these print "undefined" in your terminal, your .env file is not being read.
console.log("--- Cloudinary Config Debug ---");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "MISSING");
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "PROVIDED" : "MISSING");
console.log("-------------------------------");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resumes', // The folder name in your Cloudinary Dashboard
    resource_type: 'auto', // This allows PDF and DOCX
    allowed_formats: ['pdf', 'docx', 'doc'],
  },
});

// Create the Multer upload middleware
export const upload = multer({ storage });

// Export cloudinary instance for other uses (like deleting files)
export { cloudinary };