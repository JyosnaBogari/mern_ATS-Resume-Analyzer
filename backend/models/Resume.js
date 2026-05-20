import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  fileUrl: {
    type: String,
    required: true
  },

  publicId: {
    type: String,
    default: ""
  },

  extractedText: {
    type: String,
    default: ""
  },

  originalResume: {
    type: String,
    default: ""
  },

  atsScore: {
    type: Number,
    default: 0
  },

  suggestions: [
    {
      title: String,
      description: String
    }
  ],

  targetRole: {
    type: String,
    default: "General"
  },

  jobMatchScore: {
    type: Number,
    default: 0
  },

  // ✅ NEW FIELD
  improvedResume: {
    type: String,
    default: ""
  },
template: {
  type: String,
  default: "modern"
},
  improvedResumeUrl: {
    type: String,
    default: ""
  },
}, { timestamps: true });

export default mongoose.model(
  'Resume',
  resumeSchema
);