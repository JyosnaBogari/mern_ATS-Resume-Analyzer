function ResumePreview({ originalText, improvedText, className = '' }) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Resume</h3>
        <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {originalText || 'No text available'}
          </pre>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Improved Resume</h3>
        <div className="bg-green-50 p-4 rounded-md max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {improvedText || 'No improved version available'}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ResumePreview;