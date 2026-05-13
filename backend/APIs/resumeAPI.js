import express from "express";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/CloudinaryUpload.js";
import { extractTextFromBuffer } from "../utils/extractText.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import Resume from "../models/Resume.js";
import { analyzeResume } from "../Services/aiService.js";

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

  // Need at least 6 resume-related keywords to validate
  const isLikelyResume = matchCount >= 6;
  const matchPercentage = (matchCount / resumeKeywords.length) * 100;

  return { isLikelyResume, matchCount, matchPercentage };
};

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

      // ✅ Validate if it's actually a resume
      const validation = validateResumeContent(extractedText);
      console.log(`📋 Resume Validation: ${validation.matchCount} keywords found (${validation.matchPercentage.toFixed(1)}%)`);

      if (!validation.isLikelyResume) {
        return res.status(400).json({
          success: false,
          message: `Invalid file: Document does not appear to be a resume. Found only ${validation.matchCount} resume-related keywords. Please upload a valid resume.`
        });
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer);

      //  ✅ Call REAL Gemini API Analysis
      console.log('🤖 Analyzing resume with Gemini AI...');
      const analysisResult = await analyzeResume(extractedText, targetRole || 'General');

      //  Save to DB
      const newResume = new Resume({
        user: userId,
        fileUrl: result.secure_url,
        extractedText,
        atsScore: analysisResult.atsScore,
        suggestions: analysisResult.suggestions,
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

// ✅ Download/Generate Improved Resume
router.get("/download/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Verify ownership
    if (resume.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ Generate improved resume content
    const improvedContent = generateImprovedResume(resume);

    // Return as PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="improved-resume-${id}.pdf"`);
    res.send(improvedContent);

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Helper function to generate improved resume content
const generateImprovedResume = (resume) => {
  // For now, return a simple text representation
  // In production, you'd use a PDF library like pdfkit
  let improved = `IMPROVED RESUME\n`;
  improved += `==========================================\n\n`;
  improved += `ATS Score: ${resume.atsScore}%\n`;
  improved += `Job Match Score: ${resume.jobMatchScore}%\n`;
  improved += `Target Role: ${resume.targetRole}\n\n`;
  improved += `AI Suggestions:\n`;
  resume.suggestions.forEach((sugg, idx) => {
    improved += `${idx + 1}. ${sugg.title}\n`;
    improved += `   ${sugg.description}\n\n`;
  });
  improved += `Original Resume Content:\n`;
  improved += `------------------------------------------\n`;
  improved += resume.extractedText;

  return Buffer.from(improved);
};

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

export default router;