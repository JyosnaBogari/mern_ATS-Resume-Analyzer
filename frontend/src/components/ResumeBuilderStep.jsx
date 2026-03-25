import { useState } from 'react';
import { inputClass, labelClass, formGroup } from '../styles/common';

function ResumeBuilderStep({ step, data, onDataChange }) {
  const [experience, setExperience] = useState(data.experience || []);
  const [education, setEducation] = useState(data.education || []);
  const [skills, setSkills] = useState(data.skills || []);

  const handleInputChange = (field, value) => {
    onDataChange(field, value);
  };

  const addExperience = () => {
    const newExp = { company: '', position: '', duration: '', description: '' };
    const updatedExp = [...experience, newExp];
    setExperience(updatedExp);
    onDataChange('experience', updatedExp);
  };

  const updateExperience = (index, field, value) => {
    const updatedExp = experience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperience(updatedExp);
    onDataChange('experience', updatedExp);
  };

  const addEducation = () => {
    const newEdu = { institution: '', degree: '', year: '' };
    const updatedEdu = [...education, newEdu];
    setEducation(updatedEdu);
    onDataChange('education', updatedEdu);
  };

  const updateEducation = (index, field, value) => {
    const updatedEdu = education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    setEducation(updatedEdu);
    onDataChange('education', updatedEdu);
  };

  const addSkill = () => {
    const updatedSkills = [...skills, ''];
    setSkills(updatedSkills);
    onDataChange('skills', updatedSkills);
  };

  const updateSkill = (index, value) => {
    const updatedSkills = skills.map((skill, i) => (i === index ? value : skill));
    setSkills(updatedSkills);
    onDataChange('skills', updatedSkills);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={formGroup}>
          <label className={labelClass}>First Name</label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div className={formGroup}>
          <label className={labelClass}>Last Name</label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={inputClass}
            required
          />
        </div>
      </div>
      <div className={formGroup}>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={inputClass}
          required
        />
      </div>
      <div className={formGroup}>
        <label className={labelClass}>Phone</label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={inputClass}
        />
      </div>
      <div className={formGroup}>
        <label className={labelClass}>Address</label>
        <textarea
          value={data.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className={inputClass}
          rows={3}
        />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className={formGroup}>
      <label className={labelClass}>Professional Summary</label>
      <textarea
        value={data.summary}
        onChange={(e) => handleInputChange('summary', e.target.value)}
        className={inputClass}
        rows={6}
        placeholder="Write a brief summary of your professional background and career goals..."
      />
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-4">
      {experience.map((exp, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => updateExperience(index, 'company', e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Position"
              value={exp.position}
              onChange={(e) => updateExperience(index, 'position', e.target.value)}
              className={inputClass}
            />
          </div>
          <input
            type="text"
            placeholder="Duration (e.g., Jan 2020 - Present)"
            value={exp.duration}
            onChange={(e) => updateExperience(index, 'duration', e.target.value)}
            className={inputClass + " mt-2"}
          />
          <textarea
            placeholder="Job description and achievements"
            value={exp.description}
            onChange={(e) => updateExperience(index, 'description', e.target.value)}
            className={inputClass + " mt-2"}
            rows={3}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addExperience}
        className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
      >
        + Add Work Experience
      </button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              className={inputClass}
            />
          </div>
          <input
            type="text"
            placeholder="Year of Graduation"
            value={edu.year}
            onChange={(e) => updateEducation(index, 'year', e.target.value)}
            className={inputClass + " mt-2"}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addEducation}
        className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
      >
        + Add Education
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      {skills.map((skill, index) => (
        <input
          key={index}
          type="text"
          placeholder="Enter a skill"
          value={skill}
          onChange={(e) => updateSkill(index, e.target.value)}
          className={inputClass}
        />
      ))}
      <button
        type="button"
        onClick={addSkill}
        className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
      >
        + Add Skill
      </button>
    </div>
  );

  const renderStepContent = () => {
    switch (step.id) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderSummary();
      case 3:
        return renderExperience();
      case 4:
        return renderEducation();
      case 5:
        return renderSkills();
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h2>
      {renderStepContent()}
    </div>
  );
}

export default ResumeBuilderStep;