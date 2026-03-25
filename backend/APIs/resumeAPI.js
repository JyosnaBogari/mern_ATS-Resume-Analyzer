import express from "express";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/CloudinaryUpload.js";
import { extractTextFromBuffer } from "../utils/extractText.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import Resume from "../models/Resume.js";

const router = express.Router();

router.post(
  "/upload",
  authenticateToken,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("FILE:", req.file);
      console.log("BODY:", req.body);

      const { targetRole } = req.body;
      const userId = req.user.userId;

      //  Extract text
      const extractedText = await extractTextFromBuffer(req.file.buffer);

      // Upload to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer);

      //  FIXED suggestions format
      const analysisResult = {
        atsScore: 75,
        suggestions: [
          {
            title: "Add more keywords",
            description: "Include more relevant keywords related to the job role."
          },
          {
            title: "Improve skills section",
            description: "Make your skills section more clear and structured."
          }
        ],
        jobMatchScore: 70,
      };

      //  Save to DB
      const newResume = new Resume({
        user: userId,
        fileUrl: result.secure_url,
        extractedText,
        atsScore: analysisResult.atsScore,
        suggestions: analysisResult.suggestions, //  correct format
        targetRole: targetRole || "General",
        jobMatchScore: analysisResult.jobMatchScore,
      });

      await newResume.save();

      res.status(200).json({
        success: true,
        message: "Resume uploaded & analyzed",
        data: newResume,
      });

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;