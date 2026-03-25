import { useState } from 'react';
import { saveAs } from 'file-saver';
import LoadingSpinner from './LoadingSpinner';

function DownloadButton({ resumeId, fileName = 'improved-resume.pdf', className = '' }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!resumeId) return;

    setIsDownloading(true);
    try {
      const response = await fetch(`http://localhost:3000/resume-api/download/${resumeId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download resume. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading || !resumeId}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isDownloading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          Downloading...
        </>
      ) : (
        <>
          <svg
            className="mr-2 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Download Improved Resume
        </>
      )}
    </button>
  );
}

export default DownloadButton;