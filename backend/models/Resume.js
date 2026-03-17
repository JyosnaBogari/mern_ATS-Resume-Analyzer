import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileUrl: { type: String, required: true },
  extractedText: { type: String, default: "" }, // Changed from required to default
  atsScore: { type: Number, default: 0 },
  suggestions: [{ type: String }],
  targetRole: { type: String, default: "General" },
}, { timestamps: true }); // Using timestamps is better than manual createdAt

export default mongoose.model('Resume', resumeSchema);