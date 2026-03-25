import { useState } from 'react';

function SuggestionsList({ suggestions, className = '' }) {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No suggestions available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Suggestions for Improvement</h3>
      {suggestions.map((suggestion, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <button
            onClick={() => toggleExpanded(index)}
            className="w-full flex items-center justify-between text-left focus:outline-none"
          >
            <span className="font-medium text-gray-900">
              {suggestion.title || `Suggestion ${index + 1}`}
            </span>
            <svg
              className={`h-5 w-5 text-gray-500 transform transition-transform ${
                expandedItems.has(index) ? 'rotate-180' : ''
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {expandedItems.has(index) && (
            <div className="mt-3 text-gray-700">
              <p className="whitespace-pre-line">{suggestion.description || suggestion}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SuggestionsList;