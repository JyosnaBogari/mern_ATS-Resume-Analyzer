
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
  const { uploadResume, loading, error, clearError } = useResumeStore();
  const navigate = useNavigate();

  const { handleSubmit, register, formState: { errors }, setValue } = useForm();

  const formSubmit = async (data) => {
    const selectedFile = data.file[0];

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    if (!selectedRole) {
      toast.error("Please select a target job role");
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
      formData.append("resume", selectedFile);
      formData.append("targetRole", selectedRole);

      const result = await uploadResume(formData);

      if (result) {
        toast.success("Resume uploaded and analyzed successfully!");
        navigate("/dashboard/analysis");
      }
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    }
  };

  return (
    <div className={pageBackground + " flex justify-center items-center min-h-screen"}>
      <form
        onSubmit={handleSubmit(formSubmit)}
        className={formCard + " max-w-md"}
      >
        <h1 className={formTitle}>Upload Your Resume</h1>

        <ErrorMessage message={error} />

        <JobRoleSelector
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          className="mb-4"
        />

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
        <p className="text-sm text-gray-600 mb-4">
          <span className={subHeadingClass}>Max File Size:</span> 2MB
        </p>

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
