import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

function UploadResume() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState(null);

  const formSubmit = async (data) => {
    const file = data.file[0];

    if (!file) return;

    // file type validation
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
      const res = await axios.post(
        "http://localhost:3000/resume-api/upload",
        formData,
        { withCredentials: true }
      );

      console.log("Success:", res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(formSubmit)}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-5"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Upload Resume
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Choose Resume
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            {...register("file", { required: true })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 
            file:bg-blue-600 file:text-white file:border-0 
            file:px-4 file:py-2 file:rounded-md 
            file:cursor-pointer cursor-pointer"
          />
        </div>

        {errors.file && (
          <p className="text-red-500 text-sm">File is required</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Upload Resume
        </button>
      </form>
    </div>
  );
}

export default UploadResume;