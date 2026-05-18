import { inputClass, labelClass, formGroup } from '../styles/common';

function ResumeBuilderStep({ step, data, onDataChange, errors }) {
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];

  const handleInputChange = (field, value) => {
    onDataChange(field, value);
  };

  const addExperience = () => {
    const newExp = { company: '', position: '', duration: '', description: '' };
    onDataChange('experience', [...experience, newExp]);
  };

  const updateExperience = (index, field, value) => {
    const updatedExp = experience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    onDataChange('experience', updatedExp);
  };

  const addEducation = () => {
    const newEdu = { institution: '', degree: '', year: '' };
    onDataChange('education', [...education, newEdu]);
  };

  const updateEducation = (index, field, value) => {
    const updatedEdu = education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    onDataChange('education', updatedEdu);
  };

  const addSkill = () => {
    onDataChange('skills', [...skills, '']);
  };

  const updateSkill = (index, value) => {
    const updatedSkills = skills.map((skill, i) => (i === index ? value : skill));
    onDataChange('skills', updatedSkills);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={formGroup}>
          <label className={labelClass}>First Name</label>
          <input
            type="text"
            value={data.firstName}
            placeholder='John'
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={inputClass}
            required
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.firstName}
            </p>
          )}
        </div>
        <div className={formGroup}>
          <label className={labelClass}>Last Name</label>
          <input
            type="text"
            value={data.lastName}
            placeholder='Michael'
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={inputClass}
            required
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>
      <div className={formGroup}>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          value={data.email}
          placeholder='test@gmail.com'
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={inputClass}
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>
      <div className={formGroup}>
        <label className={labelClass}>Phone</label>
        <input
          type="tel"
          value={data.phone}
          placeholder='+91 9876564534'
          onChange={(e) => {
            const value =
              e.target.value.replace(/\D/g, '');

            handleInputChange('phone', value);
          }}
          className={inputClass}
          maxLength={10}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">
            {errors.phone}
          </p>
        )}
      </div>
      <div className={formGroup}>
        <label className={labelClass}>Address</label>
        <textarea
          value={data.address}
          placeholder="Jodimetla,Hyderabad Arundatti colony"
          onChange={(e) => handleInputChange('address', e.target.value)}
          className={inputClass}
          rows={3}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-500">
            {errors.address}
          </p>
        )}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className={formGroup}>
      <label className={labelClass}>Professional Summary</label>
      <textarea
        value={data.summary}
        onChange={(e) => handleInputChange('summary', e.target.value)}
        className={inputClass + " min-h-45"}
        rows={6}
        placeholder="Write a brief summary of your professional background and career goals..."
      />
      {errors.summary && (
        <p className="mt-1 text-sm text-red-500">
          {errors.summary}
        </p>
      )}
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-4">
      {experience.map((exp, index) => (
        <div key={index} className="rounded-3xl border border-[#e8edf4] bg-[#f8f9fb] p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => updateExperience(index, 'company', e.target.value)}
              className={inputClass}
            />
            {errors[`company-${index}`] && (
              <p className="mt-1 text-sm text-red-500">
                {errors[`company-${index}`]}
              </p>
            )}
            <input
              type="text"
              placeholder="Position"
              value={exp.position}
              onChange={(e) => updateExperience(index, 'position', e.target.value)}
              className={inputClass}
            />
            {errors[`position-${index}`] && (
              <p className="mt-1 text-sm text-red-500">
                {errors[`position-${index}`]}
              </p>
            )}
          </div>
          <input
            type="text"
            placeholder="Duration (e.g., Jan 2020 - Present)"
            value={exp.duration}
            onChange={(e) => updateExperience(index, 'duration', e.target.value)}
            className={inputClass + " mt-3"}
          />
          {errors[`duration-${index}`] && (
            <p className="mt-1 text-sm text-red-500">
              {errors[`duration-${index}`]}
            </p>
          )}
          <textarea
            placeholder="Job description and achievements"
            value={exp.description}
            onChange={(e) => updateExperience(index, 'description', e.target.value)}
            className={inputClass + " mt-3"}
            rows={3}
          />
          {errors[`description-${index}`] && (
            <p className="mt-1 text-sm text-red-500">
              {errors[`description-${index}`]}
            </p>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addExperience}
        className="w-full inline-flex justify-center items-center gap-2 rounded-2xl border border-[#d5dae3] bg-white px-4 py-3 text-sm font-semibold text-[#1d1d1f] hover:bg-[#f7f8fa] transition duration-200"
      >
        + Add Work Experience
      </button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <div key={index} className="rounded-3xl border border-[#e8edf4] bg-[#f8f9fb] p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
              className={inputClass}
            />
            {errors[`institution-${index}`] && (
              <p className="mt-1 text-sm text-red-500">
                {errors[`institution-${index}`]}
              </p>
            )}
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              className={inputClass}
            />
            {errors[`degree-${index}`] && (
              <p className="mt-1 text-sm text-red-500">
                {errors[`degree-${index}`]}
              </p>
            )}
          </div>
          <input
            type="text"
            placeholder="Year of Graduation"
            value={edu.year}
            onChange={(e) => updateEducation(index, 'year', e.target.value)}
            className={inputClass + " mt-2"}
          />
          {errors[`year-${index}`] && (
            <p className="mt-1 text-sm text-red-500">
              {errors[`year-${index}`]}
            </p>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addEducation}
        className="w-full inline-flex justify-center items-center gap-2 rounded-2xl border border-[#d5dae3] bg-white px-4 py-3 text-sm font-semibold text-[#1d1d1f] hover:bg-[#f7f8fa] transition duration-200"
      >
        + Add Education
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      {skills.map((skill, index) => (
        <div key={index}>

          <input
            type="text"
            placeholder="Enter a skill"
            value={skill}
            onChange={(e) => updateSkill(index, e.target.value)}
            className={inputClass}
          />

          {errors[`skill-${index}`] && (
            <p className="mt-1 text-sm text-red-500">
              {errors[`skill-${index}`]}
            </p>
          )}

        </div>
      ))}
      <button
        type="button"
        onClick={addSkill}
        className="w-full inline-flex justify-center items-center gap-2 rounded-2xl border border-[#d5dae3] bg-white px-4 py-3 text-sm font-semibold text-[#1d1d1f] hover:bg-[#f7f8fa] transition duration-200"
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