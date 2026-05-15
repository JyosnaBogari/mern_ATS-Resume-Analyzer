
import { useForm } from "react-hook-form";
import { useAuth } from "../store/authStore";
import { useEffect} from "react";
import { useNavigate } from "react-router";
import { errorClass,formCard,formTitle,inputClass,formGroup,submitBtn, pageBackground } from "../styles/common";
import {toast} from 'react-hot-toast';

function SignIn() {

  const { register, handleSubmit, formState:{errors} } = useForm();
 const error=useAuth(state=>state.error);
  // console.log(error);
  const login=useAuth(state=>state.login)
  const isAuthenticated=useAuth(state=>state.isAuthenticated)
 const currentUser=useAuth(state=>state.currentUser)
 const navigate=useNavigate();

  const onUserLogin = async(userCredObj)=>{
    await login(userCredObj);
  }

  useEffect(()=>{

    if(isAuthenticated && currentUser)
    {
      
        toast.success("Logged In successfully")
         navigate('/dashboard')
    }
  },[isAuthenticated,currentUser])
  return (
  <div className={pageBackground + " flex items-center justify-center px-4 py-12"}>
    <form
      onSubmit={handleSubmit(onUserLogin)}
      className={formCard + " max-w-md"
      }
    >

      <h2 className={formTitle}>
        Welcome back
      </h2>
      <p className="text-center text-sm text-[#6e6e73] mb-6">
        Sign in to access your ATS resume tools and history.
      </p>

      {/* Select Role */}
      {error && <p className={errorClass}>{error}</p>}
      {errors.role && (
        <p className="text-red-500 text-sm mb-2">
          Role is required
        </p>
      )}

      {/* Email */}
      <div className={formGroup}>
        <input
          type="email"
          placeholder="Email"
          className={inputClass}
          {...register("email",{required:true})}
        />

        {errors.email && (
          <p className="text-red-500 text-sm mb-2">
            Email required
          </p>
        )}
      </div>

      {/* Password */}
      <div className={formGroup}>
        <input
          type="password"
          placeholder="Password"
          className={inputClass}
          {...register("password",{required:true})}
        />

        {errors.password && (
          <p className="text-red-500 text-sm mb-2">
            Password required
          </p>
        )}
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className={submitBtn}
      >
        Sign In
      </button>

    </form>
   
  </div>
);
}

export default SignIn;