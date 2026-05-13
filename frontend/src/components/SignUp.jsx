import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

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
      const res = await axios.post(
        "http://localhost:3000/user-api/users",
        formData,
        { withCredentials: true }
      );

      console.log(res.data);
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-5"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Register
        </h1>

        <input
          type="text"
          placeholder="First Name"
          {...register("firstName")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Last Name"
          {...register("lastName")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;