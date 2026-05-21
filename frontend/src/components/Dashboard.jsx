import { useContext } from 'react';
import { Link } from 'react-router';
import { ResumeContext } from '../contexts/ResumeContext';
import { headingClass, cardClass, bodyText, primaryBtn } from '../styles/common';

function Dashboard() {
  const { currentResume } = useContext(ResumeContext);

  return (
    <div className="p-6">
      <h1 className={headingClass + " mb-6"}>Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={cardClass}>
          <h3 className="font-semibold mb-2">Upload Resume</h3>
          <p className={bodyText + " mb-4"}>Upload your resume to get ATS compatibility score.</p>
          <Link to="/dashboard/upload-resume" className={primaryBtn}>Upload Now</Link>
        </div>
        <div className={cardClass}>
          <h3 className="font-semibold mb-2">Create Resume</h3>
          <p className={bodyText + " mb-4"}>Build a new resume with our templates.</p>
          <Link to="/dashboard/create-resume" className={primaryBtn}>Create Now</Link>
        </div>
        <div className={cardClass}>
          <h3 className="font-semibold mb-2">Resume History</h3>
          <p className={bodyText + " mb-4"}>View and manage your uploaded resumes.</p>
          <Link to="/dashboard/history" className={primaryBtn}>View History</Link>
        </div>
        {currentResume && (
          <div className={cardClass + " border-blue-200 bg-blue-50"}>
            <h3 className="font-semibold mb-2 text-blue-900">Latest Analysis</h3>
            <p className={bodyText + " mb-2 text-blue-800"}>
              ATS Score: {currentResume.atsScore || 0}%
            </p>
            <p className="text-sm text-blue-700 mb-4">
              Target Role: {currentResume.targetRole || 'General'}
            </p>
            <Link to="/dashboard/analysis" className={primaryBtn + " bg-blue-600 hover:bg-blue-700"}>
              View Results
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;