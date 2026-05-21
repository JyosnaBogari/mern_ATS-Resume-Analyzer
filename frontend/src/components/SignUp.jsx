import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

function Register() {
  const { register, handleSubmit } = useForm();
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const formData = new FormData();

    // append text fields
    Object.keys(data).forEach((key) => {
      if (key !== "profileImage") {
        formData.append(key, data[key]);
      }
    });

    // append image
    if (data.profileImage[0]) {
      formData.append("profileImage", data.profileImage[0]);
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await axios.post(
        `${API_URL}/user-api/users`,
        formData,
        { withCredentials: true }
      );

      toast.success("Account created successfully! Please sign in.");
      navigate("/signin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 py-10 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg rounded-[28px] border border-[#e8ebf2] bg-white p-8 shadow-sm space-y-6"
      >
        <div>
          <h1 className="text-3xl font-semibold text-[#1d1d1f] text-center">Create your account</h1>
          <p className="mt-2 text-sm text-[#6e6e73] text-center">Start building ATS-optimized resumes in minutes.</p>
        </div>

        <input
          type="text"
          placeholder="First Name"
          {...register("firstName", { required: true })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Last Name"
          {...register("lastName", { required: true })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Profile Image */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Profile Image
          </label>

          <input
            type="file"
            accept="image/png, image/jpeg"
            {...register("profileImage")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 file:bg-blue-500 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-md file:cursor-pointer"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setPreview(url);
              }
            }}
          />
        </div>

        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#0066cc] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#004499]"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Register;