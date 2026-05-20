# Project Progress

## Current Focus
- Backend resume generation pipeline for ATS-friendly PDF export.
- Restored and improved PDF rendering using Puppeteer and HTML/CSS templates.
- Fixed parser and template utility files that were previously incomplete or broken.

## Repository Structure

### Root
- `README.md` - project overview and setup instructions.
- `INTERVIEW_QUESTIONS.md` - interview question notes.
- `PROGRESS.md` - this progress summary file.

### backend/
- `backend/server.js` - Express server entry point.

#### APIs
- `backend/APIs/resumeAPI.js` - resume-related routes, including download/generation endpoints.

#### controllers/
- `backend/controllers/resumeController.js` - route handler that delegates resume generation to utility functions.

#### utils/
- `backend/utils/resumeGenerator.js` - core resume PDF generation pipeline.
  - cleans raw resume text
  - parses the resume into structured sections
  - builds HTML using resume templates
  - generates an A4 PDF via Puppeteer
- `backend/utils/parseResume.js` - parser that extracts resume sections from plain text.
  - extracts summary, skills, education, experience, projects, certifications, achievements, languages
  - normalizes common section headings
- `backend/utils/resumeHtmlTemplate.js` - HTML/CSS resume templates.
  - includes professional `modern` and `sidebar` layouts
  - defines print-safe page settings and typography
- `backend/utils/extractText.js` - existing text extraction utility (not modified in current work).

#### models/
- `backend/models/Resume.js` - Mongoose schema for storing resumes and metadata.

#### config/ and middleware/
- `backend/config/` - contains auth, Cloudinary, multer, and other configuration support.
- `backend/middleware/authMiddleware.js` - JWT/authentication middleware for protected routes.

### frontend/
- `frontend/package.json` - frontend dependencies.
- `frontend/vite.config.js` - Vite configuration.
- `frontend/src/` - application source.
  - `App.jsx` / `main.jsx` - app entrypoints.
  - `components/` - UI components used across the app.
  - `services/` - API service wrappers.
  - `contexts/` / `store/` - state management and context.

## What has been done so far
- Rebuilt `backend/utils/resumeGenerator.js` for safer parsing and Puppeteer rendering.
- Recreated `backend/utils/parseResume.js` to support structured section extraction.
- Recreated `backend/utils/resumeHtmlTemplate.js` to provide professional HTML/CSS resume output.
- Verified syntax of updated backend utility files.
- Identified and corrected a production crash caused by undefined regex capture handling in `resumeGenerator.js`.

## Next steps
- Validate end-to-end resume PDF generation through the API.
- Confirm template rendering and page break behavior in PDF output.
- Continue stabilizing backend routes and frontend integration for improved resume download.
