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
  {
    id: 6,
    title: 'Awards & Achievements',
    fields: ['awards']
  },
  {
  id: 7,
  title: "Template"
}
];

function ResumeBuilder({
  onSave = () => { },
  className = '',
  isSaving = false,
  compact = false,
  data = null,
  onDataChange = null,
}) {

  const [currentStep, setCurrentStep] =
    useState(1);
  const [errors, setErrors] = useState({});
  const [internalResumeData, setInternalResumeData] =
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
      awards: [],
      template: 'modern',
    });

  const resumeData = data || internalResumeData;

  const handleNext = () => {

    const isValid = validateCurrentStep();

    if (!isValid) {
      return;
    }

    if (currentStep < steps.length) {

      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  //handleDataChange
 const handleDataChange = (field, value) => {
  if (onDataChange) {
    onDataChange(field, value);
  } else {
    setInternalResumeData(prev => ({
      ...prev,
      [field]: value,
    }));
  }

  // remove error immediately while typing
  setErrors(prev => ({
    ...prev,
    [field]: ''
  }));
};

  // for validation of the fields
 const validateCurrentStep = () => {

  let newErrors = {};

  // STEP 1 → PERSONAL INFO
  if (currentStep === 1) {

    // First Name
    if (!resumeData.firstName.trim()) {
      newErrors.firstName = "Please enter your first name";
    }

    // Last Name
    if (!resumeData.lastName.trim()) {
      newErrors.lastName = "Please enter your last name";
    }

    // Email
    if (!resumeData.email.trim()) {

      newErrors.email = "Please enter your email address";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resumeData.email)
    ) {

      newErrors.email = "Please enter a valid email address";
    }

    // Phone
    if (!resumeData.phone.trim()) {

      newErrors.phone = "Please enter your phone number";

    } else if (
      !/^[0-9]{10}$/.test(resumeData.phone)
    ) {

      newErrors.phone = "Phone number must contain exactly 10 digits";
    }

    // Address
    if (!resumeData.address.trim()) {
      newErrors.address = "Please enter your address";
    }
  }

  // STEP 2 → SUMMARY
  if (currentStep === 2) {

    if (!resumeData.summary.trim()) {
      newErrors.summary =
        "Please enter your professional summary";
    }
  }

  // STEP 3 → EXPERIENCE
  if (currentStep === 3) {

    if (resumeData.experience.length === 0) {

      newErrors.experience =
        "Please add at least one work experience";

    } else {

(resumeData.experience || []).forEach((exp, index) => {

        if (!exp.company?.trim()) {
          newErrors[`company-${index}`] =
            "Please enter company name";
        }

        if (!exp.position?.trim()) {
          newErrors[`position-${index}`] =
            "Please enter position";
        }

        if (!exp.duration?.trim()) {
          newErrors[`duration-${index}`] =
            "Please enter duration";
        }

        if (!exp.description?.trim()) {
          newErrors[`description-${index}`] =
            "Please enter description";
        }
      });
    }
  }

  // STEP 4 → EDUCATION
  if (currentStep === 4) {

    if (resumeData.education.length === 0) {

      newErrors.education =
        "Please add at least one education detail";

    } else {

(resumeData.education || []).forEach((edu, index) => {

        if (!edu.institution?.trim()) {
          newErrors[`institution-${index}`] =
            "Please enter institution name";
        }

        if (!edu.degree?.trim()) {
          newErrors[`degree-${index}`] =
            "Please enter degree";
        }

        if (!edu.year?.trim()) {
          newErrors[`year-${index}`] =
            "Please enter graduation year";
        }
      });
    }
  }

  // STEP 5 → SKILLS
  if (currentStep === 5) {

    if ((resumeData.skills || []).length === 0) {

      newErrors.skills =
        "Please add at least one skill";

    } else {

      (resumeData.skills || []).forEach((skill, index) => {

        if (!skill.trim()) {
          newErrors[`skill-${index}`] =
            "Please enter a skill";
        }
      });
    }
  }

  // STEP 6 → AWARDS & ACHIEVEMENTS
  if (currentStep === 6) {
    // Awards are optional, no strict validation required.
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const handleSave = () => {
    onSave(resumeData);
  };

  const currentStepData =
    steps.find(
      step => step.id === currentStep
    );

  const wrapperClass = compact
    ? `w-full ${className}`
    : `max-w-[1200px] mx-auto px-4 sm:px-6 pb-12 ${className}`;

  return (

    <div className={wrapperClass}>

      <div className={cardClass}>

        <h1 className={formTitle + " mb-8 text-center"}>
          Build your resume
        </h1>

        {/* Progress Bar */}
        <div className="mb-8">

          <div className="flex flex-col gap-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`rounded-2xl py-2 px-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-center transition duration-200 ${step.id <= currentStep
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
  errors={errors}
/>

        {/* Navigation */}

        <div className="flex flex-col gap-3 mt-8 sm:flex-row sm:items-center sm:justify-between">

          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}

            className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md ${currentStep === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
          >
            Previous
          </button>

          {currentStep < steps.length ? (

            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Next
            </button>

          ) : (

            <button
              onClick={handleSave}
              disabled={isSaving}
              className={submitBtn + ' w-full sm:w-auto'}
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