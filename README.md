# AI-Powered Resume Analyzer

A full-stack MERN application that analyzes resumes using AI to provide ATS compatibility scores, job matching, and personalized improvement suggestions.

## 🚀 Features

- **User Authentication**: JWT-based login with refresh tokens
- **Resume Upload**: Support for PDF and DOCX files
- **AI Analysis**: OpenAI-powered ATS scoring and suggestions
- **Job Matching**: Role-specific resume analysis
- **Resume History**: Track and manage uploaded resumes
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **Real-time Feedback**: Live analysis results and progress indicators

## 🏗️ Architecture

### Frontend (React + Vite)
- **Location**: `/frontend`
- **Tech Stack**: React 19, Vite, Tailwind CSS, Zustand, Axios
- **Features**: Responsive UI, state management, API integration

### Backend (Node.js + Express)
- **Location**: `/backend`
- **Tech Stack**: Node.js, Express, MongoDB, JWT, OpenAI API
- **Features**: RESTful APIs, authentication, file processing, AI integration

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB (local or cloud)
- OpenAI API key
- Cloudinary account (for file storage)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ats-resume-checker
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Environment Configuration

Create `.env` files in both backend and frontend directories:

**Backend (.env)**:
```env
DB_URL=mongodb://localhost:27017/resume_analyzer
PORT=3000
SECRET_KEY=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
```

**Frontend**: No additional env vars needed (uses default localhost URLs)

## 🚀 Running the Application

1. **Start Backend**:
   ```bash
   cd backend && npm start
   ```
   Server runs on `http://localhost:3000`

2. **Start Frontend**:
   ```bash
   cd frontend && npm run dev
   ```
   App runs on `http://localhost:5173`

3. **Access Application**:
   Open `http://localhost:5173` in your browser

## 📁 Project Structure

```
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
```

## 🔧 API Documentation

### Authentication Endpoints
- `POST /user-api/users` - User registration
- `POST /user-api/authenticate` - User login
- `GET /user-api/logout` - User logout
- `POST /user-api/refresh` - Refresh JWT token

### Resume Endpoints (Authenticated)
- `POST /resume-api/upload` - Upload and analyze resume
- `GET /resume-api/history` - Get resume history
- `GET /resume-api/:id` - Get specific resume
- `POST /resume-api/analyze` - Re-analyze resume
- `GET /resume-api/download/:id` - Download improved resume

## 🎨 UI Components

### Key Frontend Components
- **SignIn/SignUp**: Authentication forms
- **Dashboard**: Main user dashboard
- **DashboardUploadResume**: Resume upload interface
- **AnalysisResults**: ATS analysis display
- **ResumeHistory**: Resume management
- **ResumeBuilder**: Resume creation wizard
- **ScoreVisualization**: ATS score charts

## 🤖 AI Features

- **ATS Scoring**: Analyzes resume compatibility with ATS systems
- **Keyword Analysis**: Identifies relevant keywords for target roles
- **Improvement Suggestions**: AI-generated recommendations
- **Job Matching**: Role-specific analysis and scoring

## 📱 Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Adaptive layouts** for all screen sizes
- **Touch-friendly interfaces**
- **Optimized performance** on mobile devices

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password hashing** with bcrypt
- **CORS configuration**
- **Input validation** and sanitization
- **Secure file upload** with type/size validation

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 for process management
3. Configure nginx reverse proxy
4. Set up SSL certificates

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Serve static files from `dist/` directory
3. Configure routing for SPA

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Happy coding! 🎉**