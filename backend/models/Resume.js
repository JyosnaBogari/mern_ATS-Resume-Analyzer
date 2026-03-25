import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  extractedText: { type: String, default: "" },
  atsScore: { type: Number, default: 0 },
  suggestions: [{
    title: { type: String },
    description: { type: String }
  }],
  targetRole: { type: String, default: "General" },
  jobMatchScore: { type: Number, default: 0 },
  improvedResumeUrl: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);