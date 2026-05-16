import { useContext } from 'react';
import ScoreVisualization from './ScoreVisualization';
import SuggestionsList from './SuggestionsList';
import DownloadButton from './DownloadButton';
import ResumePreview from './ResumePreview';
import { ResumeContext } from '../contexts/ResumeContext';
import { cardClass, headingClass } from '../styles/common';

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

  const { atsScore, suggestions, jobMatchScore, targetRole, _id, extractedText, improvedResume } = analysisData;

  return (
    <div className={`space-y-6 ${className}`}>
      <div className={cardClass + " p-8"}>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className={headingClass}>Resume Analysis Results</h2>
            <p className="mt-2 text-sm text-[#6e6e73] max-w-2xl">A clear summary of your ATS score, job match strength, and actionable suggestions.</p>
          </div>
          <div className="rounded-3xl bg-[#f4f8ff] px-4 py-3 text-sm font-semibold text-[#004499] shadow-sm">Score: {atsScore || 0}%</div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr] mb-6">
          <div className="flex justify-center rounded-3xl bg-[#f8fafe] p-6">
            <ScoreVisualization score={atsScore || 0} />
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-[#e8ebf2] bg-[#f8f9fb] p-5">
              <h3 className="font-semibold text-[#1d1d1f] mb-2">Job Match Score</h3>
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

      <ResumePreview
        originalText={extractedText}
        improvedText={improvedResume}
        className="mt-6"
      />
    </div>
  );
}

export default AnalysisResults;