
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { formCard, formTitle, formGroup, labelClass, inputClass, submitBtn, subHeadingClass, pageBackground } from "../styles/common";
import JobRoleSelector from "./JobRoleSelector";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { useResumeStore } from "../store/resumeStore";
import { validateFile } from "../utils/fileUtils";
import { toast } from "react-hot-toast";

function DashboardUploadResume() {
  const [selectedRole, setSelectedRole] = useState("");
  const [template, setTemplate] =useState("classic");
  const { uploadResume, loading, error, clearError } = useResumeStore();
  const navigate = useNavigate();

  const { handleSubmit, register, formState: { errors }, setValue } = useForm();
  const formSubmit = async (data) => {

    const selectedFile = data.file[0];

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const validation = validateFile(selectedFile);

    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    try {

      clearError();

     const formData = new FormData();

formData.append(
  "resume",
  selectedFile
);

// OPTIONAL ROLE
formData.append(
  "targetRole",
  selectedRole || "General"
);

// TEMPLATE
formData.append(
  "template",
  template
);

      const result =
        await uploadResume(formData);

      if (result) {

        toast.success(
          selectedRole
            ? "Role-based resume analysis completed!"
            : "General ATS analysis completed!"
        );

        navigate("/dashboard/analysis");
      }

    } catch (err) {

      toast.error(
        "Upload failed. Please try again."
      );
    }
  };

  return (
    <div className=" px-2 py-2 ">
      <form
        onSubmit={handleSubmit(formSubmit)}
        className={formCard + " max-w-2xl"}
      >
        <h1 className={formTitle}>ATS Resume Analyzer</h1>
        <p className="text-center text-sm text-[#6e6e73] mb-3">
          Upload a resume and choose a template to generate a polished, ATS-ready version.
        </p>

        <ErrorMessage message={error} />

        <JobRoleSelector
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          className="mb-4"
        />
        <p className="text-sm text-gray-500 mb-2">Optional: Select a target role for role-based resume analysis.</p>
        <div className={formGroup}>
          <label className={labelClass} htmlFor="file">Resume File</label>
          <input
            type="file"
            id="file"
            accept=".pdf,.doc,.docx"
            {...register("file", { required: "File is required" })}
            className={inputClass + " cursor-pointer"}
          />
          {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>}
        </div>

        <p className="text-sm text-gray-600 mb-2">
          <span className={subHeadingClass}>Supported File Types:</span> PDF, DOC, DOCX
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <span className={subHeadingClass}>Max File Size:</span> 2MB
        </p>
        
        <div className="mb-4">
  <label className="block text-sm font-semibold mb-2">
    Resume Template
  </label>
<select
  value={template}
  onChange={(e) => setTemplate(e.target.value)}
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="classic">Classic</option>
  <option value="modern">Modern</option>
  <option value="minimal">Minimal</option>
</select>
</div>

        <button
          type="submit"
          disabled={loading}
          className={submitBtn + " w-full flex justify-center items-center"}
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Analyzing...
            </>
          ) : (
            "Upload & Analyze"
          )}
        </button>
      </form>
    </div>
  );
}

export default DashboardUploadResume;
