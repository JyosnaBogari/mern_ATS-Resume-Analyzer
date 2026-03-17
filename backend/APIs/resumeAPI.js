import express from 'express';
const router = express.Router();
import { upload } from '../config/cloudinary.js';
import Resume from '../models/Resume.js';
import { extractTextFromURL } from '../utils/extractText.js';

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    // 1. Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = req.file.path;

    // 2. Extract Text
    const extractedText = await extractTextFromURL(fileUrl);

    // 3. Save to MongoDB
    const newResume = new Resume({
      fileUrl: fileUrl,
      extractedText: extractedText || "No text content found",
    });

    await newResume.save();

    // 4. Send response
    res.status(200).json({
      success: true,
      message: "Resume uploaded, parsed, and saved!",
      data: {
        id: newResume._id,
        url: fileUrl,
        textPreview: extractedText ? extractedText.substring(0, 150) + "..." : "Empty"
      }
    });

  } catch (error) { // The catch must follow the try block directly
    console.error("Critical Upload Error:", error.message || error);
    
    res.status(500).json({ 
      success: false, 
      message: "Server failed to process resume", 
      error: error.message || "Unknown error"
    });
  }
});

export default router;