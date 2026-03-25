import React, { useState, useEffect, useContext } from 'react';
import { ResumeContext } from '../contexts/ResumeContext';
import HistoryFilters from './HistoryFilters';
import DownloadButton from './DownloadButton';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { cardClass, headingClass, bodyText, primaryBtn, secondaryBtn } from '../styles/common';

function ResumeHistory() {
  const { resumeHistory, fetchResumeHistory, loading, error } = useContext(ResumeContext);
  const [filteredResumes, setFilteredResumes] = useState([]);

  useEffect(() => {
    fetchResumeHistory();
  }, [fetchResumeHistory]);

  useEffect(() => {
    setFilteredResumes(resumeHistory);
  }, [resumeHistory]);

  const handleFilterChange = (filters) => {
    let filtered = [...resumeHistory];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(resume =>
        resume.extractedText?.toLowerCase().includes(filters.search.toLowerCase()) ||
        resume.targetRole?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case 'date':
          aValue = new Date(a.createdAt || a.uploadedAt);
          bValue = new Date(b.createdAt || b.uploadedAt);
          break;
        case 'score':
          aValue = a.atsScore || 0;
          bValue = b.atsScore || 0;
          break;
        case 'role':
          aValue = a.targetRole || '';
          bValue = b.targetRole || '';
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredResumes(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className={headingClass + " mb-6"}>Resume History</h1>

      <ErrorMessage message={error} />

      <HistoryFilters onFilterChange={handleFilterChange} />

      {filteredResumes.length === 0 ? (
        <p className={bodyText}>No resumes found.</p>
      ) : (
        <div className="grid gap-4">
          {filteredResumes.map((resume) => (
            <div key={resume._id} className={cardClass}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Resume Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Uploaded: {formatDate(resume.createdAt || resume.uploadedAt)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Target Role: {resume.targetRole || 'General'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {resume.atsScore || 0}%
                  </div>
                  <div className="text-sm text-gray-600">ATS Score</div>
                </div>
              </div>

              <p className={bodyText + " mb-4 line-clamp-3"}>
                {resume.extractedText?.substring(0, 200) + '...' || 'No text content'}
              </p>

              <div className="flex gap-2 flex-wrap">
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={primaryBtn}
                >
                  View Original
                </a>
                <DownloadButton
                  resumeId={resume._id}
                  fileName={`improved-resume-${resume._id}.pdf`}
                  className="text-sm px-3 py-1"
                />
                <button className={secondaryBtn + " text-sm px-3 py-1"}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResumeHistory;
