import { useState } from 'react';
import ResumeBuilderStep from './ResumeBuilderStep';
import {
  cardClass,
  formTitle,
  submitBtn
} from '../styles/common';

const steps = [
  {
    id: 1,
    title: 'Personal Information',
    fields: [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address'
    ]
  },
  {
    id: 2,
    title: 'Professional Summary',
    fields: ['summary']
  },
  {
    id: 3,
    title: 'Work Experience',
    fields: ['experience']
  },
  {
    id: 4,
    title: 'Education',
    fields: ['education']
  },
  {
    id: 5,
    title: 'Skills',
    fields: ['skills']
  },
];

function ResumeBuilder({
  onSave = () => {},
  className = '',
  isSaving = false
}) {

  const [currentStep, setCurrentStep] =
    useState(1);

  const [resumeData, setResumeData] =
    useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      summary: '',
      experience: [],
      education: [],
      skills: [],
      template: 'modern',
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

  const handleDataChange = (
    field,
    value
  ) => {

    setResumeData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(resumeData);
  };

  const currentStepData =
    steps.find(
      step => step.id === currentStep
    );

  return (

    <div className={`max-w-5xl mx-auto px-4 sm:px-6 pb-12 ${className}`}>

      <div className={cardClass}>

        <h1 className={formTitle + " mb-8 text-center"}>
          Build your premium resume
        </h1>

        {/* Progress Bar */}
        <div className="mb-8">

          <div className="flex flex-col gap-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`rounded-2xl py-3 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-center transition duration-200 ${
                  step.id <= currentStep
                    ? 'bg-[#e5f0ff] text-[#004499] shadow-sm'
                    : 'bg-[#f4f6f9] text-[#8c95a2]'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>

          <div className="w-full bg-[#e7ecf4] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#0066cc] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

        {/* Current Step */}

        <ResumeBuilderStep
          step={currentStepData}
          data={resumeData}
          onDataChange={handleDataChange}
        />

        {/* Template Selection */}

        <div className="mt-8">

          <h3 className="text-lg font-semibold mb-4">
            Choose Resume Template
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* MODERN TEMPLATE */}

            <div
              onClick={() =>
                handleDataChange(
                  'template',
                  'modern'
                )
              }

              className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                resumeData.template === 'modern'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >

              <img
                src="/template1.png"
                alt="Modern Template"
                className="rounded-3xl mb-4 h-52 w-full object-cover border border-[#e7ecf4] shadow-sm"
              />

              <h4 className="font-semibold text-center text-[#1d1d1f]">
                Modern Template
              </h4>

            </div>

            {/* SIDEBAR TEMPLATE */}

            <div
              onClick={() =>
                handleDataChange(
                  'template',
                  'sidebar'
                )
              }

              className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                resumeData.template === 'sidebar'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >

              <img
                src="/template2.jpg"
                alt="Sidebar Template"
                className="rounded-3xl mb-4 h-52 w-full object-cover border border-[#e7ecf4] shadow-sm"
              />

              <h4 className="font-semibold text-center text-[#1d1d1f]">
                Sidebar Template
              </h4>

            </div>

          </div>

        </div>

        {/* Navigation */}

        <div className="flex flex-col gap-3 mt-8 sm:flex-row sm:items-center sm:justify-between">

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
              disabled={isSaving}
              className={submitBtn}
            >
              {
                isSaving
                  ? 'Generating...'
                  : 'Generate Resume'
              }
            </button>

          )}

        </div>

      </div>

    </div>
  );
}

export default ResumeBuilder;