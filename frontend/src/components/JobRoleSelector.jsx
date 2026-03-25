import { useState } from 'react';

const jobRoles = [
  'Software Engineer',
  'Data Scientist',
  'Product Manager',
  'UX Designer',
  'Marketing Manager',
  'Sales Representative',
  'Business Analyst',
  'DevOps Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Project Manager',
  'HR Manager',
  'Financial Analyst',
  'Other'
];

function JobRoleSelector({ selectedRole, onRoleChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Target Job Role
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left"
      >
        <span className="block truncate">
          {selectedRole || 'Select a job role'}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className={`h-5 w-5 text-gray-400 transform ${isOpen ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          {jobRoles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                onRoleChange(role);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                selectedRole === role ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobRoleSelector;