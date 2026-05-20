import express from "express";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/CloudinaryUpload.js";
import { extractTextFromBuffer } from "../utils/extractText.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import Resume from "../models/Resume.js";
import { analyzeResume } from "../Services/aiService.js";
import { generateResumePdf } from "../utils/resumeGenerator.js";
import { generateResume } from "../controllers/resumeController.js";
const router = express.Router();

// ✅ Validate if extracted text looks like a resume
const validateResumeContent = (text) => {
  const resumeKeywords = [
    'experience', 'education', 'skills', 'work', 'employment',
    'degree', 'university', 'college', 'certification', 'contact',
    'email', 'phone', 'linkedin', 'github', 'job', 'position',
    'responsibility', 'achievement', 'project', 'software'
  ];

  const lowerText = text.toLowerCase();
  let matchCount = 0;

  resumeKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      matchCount++;
    }
  });

  const isLikelyResume = matchCount >= 6;
  const matchPercentage = (matchCount / resumeKeywords.length) * 100;

  return { isLikelyResume, matchCount, matchPercentage };
};

router.post(
  "/generate",
  authenticateToken,
  generateResume
);

router.post(
  "/upload",
  authenticateToken,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { targetRole, template } = req.body;
      const userId = req.user.userId;

      const extractedText = await extractTextFromBuffer(req.file.buffer);

      const validation = validateResumeContent(extractedText);
      console.log(`📋 Resume Validation: ${validation.matchCount} keywords found (${validation.matchPercentage.toFixed(1)}%)`);

      if (!validation.isLikelyResume) {
        return res.status(400).json({
          success: false,
          message: `Invalid file: Document does not appear to be a resume. Found only ${validation.matchCount} resume-related keywords. Please upload a valid resume.`
        });
      }

      const result = await uploadToCloudinary(req.file.buffer);

      console.log('🤖 Analyzing resume with Gemini AI...');
      const analysisResult = await analyzeResume(extractedText, targetRole || 'General');

      const newResume = new Resume({
        user: userId,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        extractedText,
        originalResume: extractedText,
        atsScore: analysisResult.atsScore,
        suggestions: analysisResult.suggestions,
        targetRole: targetRole || "General",
        jobMatchScore: analysisResult.jobMatchScore,
        improvedResume: analysisResult.improvedResume,
        template: template || "modern",
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

// ✅ Get Resume History
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const resumes = await Resume.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: resumes
    });
  } catch (err) {
    console.error("HISTORY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get single resume by ID
router.get(["/get/:id", "/resume/:id"], authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (err) {
    console.error("GET RESUME ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete Resume
router.delete(
  "/delete/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const resume = await Resume.findById(id);

      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      if (resume.user.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await Resume.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Resume deleted successfully"
      });
    } catch (err) {
      console.error("DELETE ERROR:", err);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  }
);

// ✅ Download Improved Resume PDF
router.get(
  "/download/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const resume = await Resume.findById(id);

      if (!resume) {
        return res.status(404).json({
          message: "Resume not found"
        });
      }

      if (resume.user.toString() !== userId) {
        return res.status(403).json({
          message: "Unauthorized"
        });
      }

      const source = req.query.source === "current" ? "current" : "improved";
      await generateResumePdf(resume, res, source);

    } catch (err) {
      console.error("DOWNLOAD ERROR:", err);

      res.status(500).json({
        message: "Failed to download resume"
      });
    }
  }
);
// ✅ Re-analyze with different role
router.post("/analyze", authenticateToken, async (req, res) => {
  try {
    const { id, targetRole } = req.body;
    const userId = req.user.userId;

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Verify ownership
    if (resume.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Re-analyze with new role
    console.log(`🔄 Re-analyzing resume for ${targetRole}...`);
    const newAnalysis = await analyzeResume(resume.extractedText, targetRole);

    // Update in database
    resume.atsScore = newAnalysis.atsScore;
    resume.jobMatchScore = newAnalysis.jobMatchScore;
    resume.suggestions = newAnalysis.suggestions;
    resume.targetRole = targetRole;
    await resume.save();

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

router.put(
  ["/update/:resumeId", "/resume/:resumeId"],
  authenticateToken,
  async (req, res) => {
    try {
      const { resumeId } = req.params;
      const userId = req.user.userId;
      const resume = await Resume.findById(resumeId);

      if (!resume) {
        return res.status(404).json({
          message: "Resume not found"
        });
      }

      if (resume.user.toString() !== userId) {
        return res.status(403).json({
          message: "Unauthorized"
        });
      }

      if (req.body.improvedResume !== undefined) {
        resume.improvedResume = req.body.improvedResume;
      }
      if (req.body.extractedText !== undefined) {
        resume.extractedText = req.body.extractedText;
      }
      if (req.body.originalResume !== undefined) {
        resume.originalResume = req.body.originalResume;
      }
      if (req.body.template !== undefined) {
        resume.template = req.body.template;
      }
      if (req.body.targetRole !== undefined) {
        resume.targetRole = req.body.targetRole;
      }

      await resume.save();

      res.status(200).json({
        message: "Resume updated successfully",
        payload: resume
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Failed to update resume"
      });
    }
  }
);

export default router;