import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

function UploadResume() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [error, setError] = useState(null);

  const formSubmit = async (data) => {
    const file = data.file[0];

    if (!file) return;

    // file type validation
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, DOC, DOCX allowed");
      return;
    }

    // size validation
    if (file.size > 2 * 1024 * 1024) {
      setError("File must be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post( "http://localhost:3000/resume-api/upload",formData, {withCredentials: true}
      );

      console.log("Success:", res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        {...register("file", { required: true })}
      />

      {errors.file && <p>File is required</p>}

      <button type="submit">Upload Resume</button>
    </form>
  );
}

export default UploadResume;