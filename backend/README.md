# ATS Resume Analyzer - Backend

Node.js/Express backend for AI-powered resume analysis and ATS scoring.

## Features

- User authentication with JWT tokens
- Resume upload and text extraction (PDF/DOCX)
- AI-powered ATS scoring and suggestions
- Job role-based resume analysis
- Resume history management
- Improved resume generation

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary
- **AI**: OpenAI GPT API
- **File Processing**: PDF parsing, DOCX parsing

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `DB_URL`: MongoDB connection string
   - `PORT`: Server port (default: 3000)
   - `SECRET_KEY`: JWT secret key
   - `CLOUDINARY_*`: Cloudinary credentials
   - `OPENAI_API_KEY`: OpenAI API key

3. **Start MongoDB**
   Make sure MongoDB is running locally or update `DB_URL` for cloud MongoDB.

4. **Run the Server**
   ```bash
   npm start
   # or for development with auto-reload
   npx nodemon server.js
   ```

## API Endpoints

### Authentication
- `POST /user-api/users` - Register user
- `POST /user-api/authenticate` - Login
- `GET /user-api/logout` - Logout
- `PUT /user-api/change-password` - Change password
- `POST /user-api/refresh` - Refresh JWT token

### Resume Management (Requires Authentication)
- `POST /resume-api/upload` - Upload and analyze resume
- `GET /resume-api/history` - Get user's resume history
- `GET /resume-api/:id` - Get specific resume details
- `POST /resume-api/analyze` - Re-analyze existing resume
- `GET /resume-api/download/:id` - Download improved resume

## File Upload

- **Supported formats**: PDF, DOCX
- **Max size**: 2MB
- **Storage**: Cloudinary CDN

## AI Analysis

The system uses OpenAI GPT to provide:
- ATS compatibility scoring
- Job-specific keyword analysis
- Personalized improvement suggestions
- Resume optimization recommendations

## Database Schema

### User
- firstName, lastName, email, password
- profileImageUrl, isActive
- timestamps

### Resume
- user (reference to User)
- fileUrl, extractedText
- atsScore, jobMatchScore
- suggestions (array of objects)
- targetRole, improvedResumeUrl
- timestamps

## Error Handling

The API includes comprehensive error handling for:
- Authentication failures
- File upload issues
- AI service errors
- Database connection problems
- Invalid requests

## Security

- JWT-based authentication
- HTTP-only cookies for tokens
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization

## Development

- Uses ES modules (`"type": "module"`)
- Hot reload with nodemon
- Environment-based configuration
- Structured logging

## Deployment

1. Set environment variables in production
2. Use a process manager like PM2
3. Configure reverse proxy (nginx)
4. Set up MongoDB replica set for production
5. Enable HTTPS/SSL certificates



# Database
DB_URL=mongodb://localhost:27017/resume_analyzer

# Server
PORT=3000

# JWT Secret
SECRET_KEY=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here