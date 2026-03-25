# ATS Resume Checker - Frontend

A modern React application for AI-powered resume analysis and ATS optimization.

## 🚀 Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Resume Upload**: Support for PDF and DOCX file formats
- **AI-Powered Analysis**: ATS scoring, job matching, and improvement suggestions
- **Interactive Dashboard**: Visual analytics and resume history
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Feedback**: Live analysis results and recommendations

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors
- **Chart.js** - Data visualization
- **React Router** - Client-side routing

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AnalysisResults.jsx      # Analysis display component
│   │   ├── CreateResume.jsx         # Resume creation form
│   │   ├── Dashboard.jsx            # Main dashboard
│   │   ├── DashboardLayout.jsx      # Dashboard layout wrapper
│   │   ├── DashboardSideBar.jsx     # Sidebar navigation
│   │   ├── DashboardUploadResume.jsx # Upload component for dashboard
│   │   ├── DashnoardHeader.jsx      # Dashboard header
│   │   ├── Footer.jsx                # Footer component
│   │   ├── Header.jsx                # Main header
│   │   ├── PublicNavBar.jsx         # Public navigation
│   │   ├── ResumeHistory.jsx        # Resume history list
│   │   ├── RootLayout.jsx           # Root layout
│   │   ├── ScoreVisualization.jsx   # Score charts
│   │   ├── SignIn.jsx               # Login form
│   │   ├── SignUp.jsx               # Registration form
│   │   ├── UploadResume.jsx         # File upload component
│   ├── contexts/
│   │   ├── UploadResumeContext.js
│   │   ├── UploadResumeContextProvider.jsx
│   ├── store/
│   │   └── authStore.js             # Authentication state
│   ├── styles/
│   │   └── common.js                # Common styles
│   ├── App.css
│   ├── App.jsx                      # Main app component
│   ├── index.css
│   └── main.jsx                     # App entry point
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend root:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Component Architecture

### Core Components

- **Authentication Components**: `SignIn.jsx`, `SignUp.jsx`
- **Dashboard Components**: `Dashboard.jsx`, `DashboardLayout.jsx`, `DashboardSideBar.jsx`
- **Resume Components**: `UploadResume.jsx`, `AnalysisResults.jsx`, `ResumeHistory.jsx`
- **Layout Components**: `RootLayout.jsx`, `Header.jsx`, `Footer.jsx`

### State Management

- **Zustand Stores**: `authStore.js` for authentication state
- **React Context**: `UploadResumeContext` for file upload state
- **Local State**: Component-level state for UI interactions

## 🔐 Authentication Flow

1. User registers/logs in through `SignIn.jsx`/`SignUp.jsx`
2. JWT tokens stored in HTTP-only cookies
3. Axios interceptors handle token refresh automatically
4. Protected routes redirect to login if unauthorized

## 📊 Data Visualization

- **Chart.js Integration**: Doughnut charts for ATS scores
- **Responsive Charts**: Mobile-optimized visualizations
- **Real-time Updates**: Charts update with new analysis data

## 📱 Responsive Design

- **Mobile-First**: Tailwind CSS responsive utilities
- **Breakpoint System**: sm/md/lg/xl breakpoints
- **Touch-Friendly**: Optimized for mobile interactions

## 🔄 API Integration

- **Axios Instance**: Configured with base URL and interceptors
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Skeleton loaders and progress indicators

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Serve static files**
   ```bash
   npm run preview
   ```

3. **Deploy to hosting service** (Vercel, Netlify, etc.)

## 🧪 Testing

Run the application and test:
- User registration and login
- Resume upload (PDF/DOCX)
- Analysis results display
- Dashboard navigation
- Responsive design on different screen sizes

## 🤝 Contributing

1. Follow the existing code style
2. Use meaningful commit messages
3. Test changes thoroughly
4. Update documentation as needed

## 📝 License

This project is part of the ATS Resume Checker application.

 