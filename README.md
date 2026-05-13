# ATS Resume Checker 🚀

An AI-powered ATS Resume Analyzer built using the MERN Stack and Gemini AI that helps users improve their resumes based on ATS (Applicant Tracking System) standards and job-role specific recommendations.

---

# Features ✨

* Upload Resume (PDF)
* Extract Resume Text Automatically
* ATS Score Calculation
* Job Match Score Analysis
* AI-Powered Resume Suggestions using Gemini AI
* Resume History Tracking
* Authentication & Authorization
* Role-based Resume Analysis
* Download Improved Resume
* Responsive Modern UI

---

# Tech Stack 🛠️

## Frontend

* React.js
* Tailwind CSS
* Axios
* React Router DOM

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer
* PDF-Parse
* Gemini AI API

---

# AI Features 🤖

The application uses Google Gemini AI to:

* Analyze resume quality
* Detect missing technical skills
* Suggest ATS keyword improvements
* Identify weak project descriptions
* Improve formatting and resume structure
* Generate role-specific suggestions

---

# ATS Score Logic 📊

The ATS score is calculated based on:

* Resume structure
* Skills section
* Projects section
* Experience section
* Contact information
* Keyword matching
* Resume length
* Job-role specific technologies

---

# Supported Roles 💼

* Full Stack Developer
* Frontend Developer
* Backend Developer
* Software Engineer
* General Resume Review

---

# Project Structure 📁

backend/
│
├── Controllers/
├── Models/
├── Routes/
├── Services/
├── Middlewares/
├── Utils/
└── server.js

frontend/
│
├── Components/
├── Pages/
├── Store/
└── App.jsx






ats-resume-checker/
├── backend/
│   ├── APIs/
│   │   ├── userAPI.js          # User authentication routes
│   │   └── resumeAPI.js        # Resume management routes
│   ├── config/
│   │   └── cloudinary.js       # File upload configuration
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT authentication
│   ├── models/
│   │   ├── UserTypeModel.js    # User schema
│   │   └── Resume.js           # Resume schema
│   ├── Services/
│   │   ├── authService.js      # Auth business logic
│   │   └── aiService.js        # AI analysis service
│   ├── utils/
│   │   ├── extractText.js      # File text extraction
│   │   ├── resumeGenerator.js  # Resume generation
│   │   └── jwtUtils.js         # JWT utilities
│   ├── server.js               # Main server file
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── contexts/            # React contexts
│   │   ├── store/               # Zustand stores
│   │   ├── services/            # API service functions
│   │   ├── utils/               # Utility functions
│   │   ├── styles/              # Shared styles
│   │   └── assets/              # Static assets
│   ├── package.json
│   └── README.md
└── README.md                    # This file
---

# Installation ⚙️

## Clone Repository

git clone <your-repository-link>

---

## Backend Setup

cd backend

npm install

Create .env file:

PORT=3000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key

Run Backend:

npm run dev

---

## Frontend Setup

cd frontend

npm install

npm run dev

---

# Gemini AI Integration 🔥

This project integrates Gemini AI for intelligent resume analysis.

Model Used:

* gemini-2.5-flash

Package:

* @google/generative-ai

---

# Future Improvements 🚀

* AI Resume Builder
* Resume Templates
* Skill Gap Analysis
* Interview Question Generator
* Cover Letter Generator
* Resume Ranking System
* Multi-language Support

---

# Author 👩‍💻

Jyosna Bogari

B.Tech Information Technology

Anurag University

---

# Screenshots 📸

(Add project screenshots here)

---

# License 📄

This project is for educational and portfolio purposes.
