import { useState } from 'react';
import ResumeBuilderStep from './ResumeBuilderStep';
import { cardClass, formTitle, submitBtn } from '../styles/common';

const steps = [
  { id: 1, title: 'Personal Information', fields: ['firstName', 'lastName', 'email', 'phone', 'address'] },
  { id: 2, title: 'Professional Summary', fields: ['summary'] },
  { id: 3, title: 'Work Experience', fields: ['experience'] },
  { id: 4, title: 'Education', fields: ['education'] },
  { id: 5, title: 'Skills', fields: ['skills'] },
];

function ResumeBuilder({ onSave, className = '' }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Generate PDF or send to backend
    onSave(resumeData);
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className={cardClass}>
        <h1 className={formTitle + " mb-6"}>Build Your Resume</h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex-1 text-center text-sm font-medium ${
                  step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step */}
        <ResumeBuilderStep
          step={currentStepData}
          data={resumeData}
          onDataChange={handleDataChange}
        />

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              currentStep === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSave}
              className={submitBtn}
            >
              Generate Resume
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;