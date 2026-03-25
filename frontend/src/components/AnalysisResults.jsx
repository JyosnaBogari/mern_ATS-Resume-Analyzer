import { useContext } from 'react';
import ScoreVisualization from './ScoreVisualization';
import SuggestionsList from './SuggestionsList';
import DownloadButton from './DownloadButton';
import { ResumeContext } from '../contexts/ResumeContext';
import { cardClass, headingClass, bodyText } from '../styles/common';

function AnalysisResults({ className = '' }) {
  const { analysisResults, currentResume } = useContext(ResumeContext);

  const analysisData = analysisResults || currentResume;

  if (!analysisData) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No analysis data available. Please upload a resume first.</p>
      </div>
    );
  }

  const { atsScore, suggestions, jobMatchScore, targetRole, _id } = analysisData;

  return (
    <div className={`space-y-6 ${className}`}>
      <div className={cardClass}>
        <h2 className={headingClass + " mb-6"}>Resume Analysis Results</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex justify-center">
            <ScoreVisualization score={atsScore || 0} />
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Job Match Score</h3>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${jobMatchScore || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-blue-900">
                  {jobMatchScore || 0}%
                </span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Match for {targetRole || 'selected role'}
              </p>
            </div>

            <div className="text-center">
              <DownloadButton resumeId={_id} />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <SuggestionsList suggestions={suggestions || []} />
        </div>
      </div>
    </div>
  );
}

export default AnalysisResults;