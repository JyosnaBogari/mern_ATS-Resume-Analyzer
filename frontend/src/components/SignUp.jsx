

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import {useNavigate} from 'react-router'
import { NavLink } from 'react-router'
import {loadingClass,
  errorClass,
  formCard,
  formTitle,
  labelClass,
  inputClass,
  formGroup,
  submitBtn} from "../styles/common.js"
function Register() {

  const { register, handleSubmit, formState:{errors} } = useForm()
const [loading,setLoading]=useState(false)
const [error,setError]=useState(null)
const navigate=useNavigate()
//const []=useState()

  const submitForm = async (userObj)=>{
    setLoading(true)
   try{
        let resObj=await axios.post("http://localhost:3000/user-api/users",userObj,{withCredentials:true})
        let res=resObj.data
        console.log(resObj)
        if(resObj.status===201){
          navigate("/login")
        }
   }
   catch(err){
    console.log("err is",err);
    setError(err.response?.data?.error || "Registration failed")
   }
   finally{
    setLoading(false)
   }
   if(loading===true){
    return <p className={loadingClass}>Loading...</p>
   }


  }

  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
   

    <form
      onSubmit={handleSubmit(submitForm)}
      className={formCard}
    >
        {error && <p className={errorClass}>{error}</p>}
      <h2 className={formTitle}>
        SignUp
      </h2>

      
      {/* Name fields */}
      <div className="flex flex-col md:flex-row gap-2 mb-3">
        <input
          type="text"
          placeholder="First name"
          className={inputClass}
          {...register("firstName",{required:true,minLength:3})}
        />

        <input
          type="text"
          placeholder="Last name"
          className={inputClass}
          {...register("lastName",{required:true,minLength:3})}
        />
      </div>

      {errors.firstName && (
        <p className="text-red-500 text-sm">Firstname required</p>
      )}

      <div className={formGroup}>
        <input
          type="email"
          placeholder="Email"
          className={inputClass}
          {...register("email",{required:true})}
        />

        {errors.email && (
          <p className="text-red-500 text-sm">Email required</p>
        )}
      </div>

      <div className={formGroup}>
        <input
          type="password"
          placeholder="Password"
          className={inputClass}
          {...register("password",{required:true})}
        />

        {errors.password && (
          <p className="text-red-500 text-sm">Password required</p>
        )}
      </div>

      <div className={formGroup}>
        <input
          type="text"
          accept="image/*"
          placeholder='https://example.com/profile1-image.jpg'
          className={inputClass}
          {...register("profileImageUrl")}
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className={submitBtn}
        >
          Register
        </button>
      </div>

      <p className="text-center text-sm mt-4">
        Have already an account?{" "}
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive
              ? "text-sky-800 font-semibold underline"
              : "text-sky-600 font-medium hover:underline"
          }
        >
          Sign In
        </NavLink>
      </p>

    </form>
  </div>
)
}

export default Register