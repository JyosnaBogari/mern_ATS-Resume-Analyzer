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
        formData ,{withCredentials:true}
      );

      console.log(res.data);
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="First Name" {...register("firstName")} />
      <input type="text" placeholder="Last Name" {...register("lastName")} />
      <input type="email" placeholder="Email" {...register("email")} />
      <input type="password" placeholder="Password" {...register("password")} />

      {/*  Profile Image */}
      <input
        type="file"
        accept="image/png, image/jpeg"
        {...register("profileImage")}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
          }
        }}
      />

      {preview && <img src={preview} alt="preview" width="80" />}

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;