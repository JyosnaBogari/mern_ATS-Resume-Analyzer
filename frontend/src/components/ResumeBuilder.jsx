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
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'summary'];
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!resumeData[field]?.trim()) isValid = false;
    });

    if (resumeData.education.length === 0 || resumeData.skills.length === 0) isValid = false;

    if (!isValid) {
      toast.error("Please fill in all required fields (Personal Info, Summary, Education, and Skills)");
      return;
    }
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

          </div>
        </div>

        {/* Current Step */}
        <ResumeBuilderStep
          data={resumeData}
          onDataChange={handleDataChange}
          errors={errors}
        />

        {/* Navigation */}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={submitBtn + " w-full sm:w-auto"}
          >
            {isSaving ? "Generating..." : "Generate Resume"}
          </button>
        </div>

      </div>

    </div>
  );
}

export default ResumeBuilder;