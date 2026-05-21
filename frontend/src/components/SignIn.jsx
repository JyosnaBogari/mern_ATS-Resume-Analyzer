
import { useForm } from "react-hook-form";
import { useAuth } from "../store/authStore";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { errorClass,formCard,formTitle,inputClass,formGroup,submitBtn, pageBackground } from "../styles/common";
import {toast} from 'react-hot-toast';

function SignIn() {

  const { register, handleSubmit, formState:{errors} } = useForm();
  const error=useAuth(state=>state.error);
  const login=useAuth(state=>state.login)
  const isAuthenticated=useAuth(state=>state.isAuthenticated)
  const currentUser=useAuth(state=>state.currentUser)
  const navigate=useNavigate();
  const location = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sessionMessage, setSessionMessage] = useState('');

  const onUserLogin = async (userCredObj) => {
  try {
    await login(userCredObj);
  } catch (err) {
    toast.error(err.message || "Login failed. Please try again.");
  }
};

  useEffect(() => {
    // Check for session expiration message in URL
    const searchParams = new URLSearchParams(location.search);
    const message = searchParams.get('message');
    
    if (message === 'session_expired') {
      setSessionMessage('Your session has expired. Please login again to continue.');
    } else if (message === 'please_login') {
      setSessionMessage('Please sign in to access this feature.');
    } else if (message === 'invalid_session') {
      setSessionMessage('Your session is invalid. Please login again.');
    }
  }, [location.search]);

 useEffect(() => {

  if (isAuthenticated && currentUser) {
    navigate('/dashboard', { replace: true });
  }
}, [isAuthenticated, currentUser]);
  
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

      {/* ✅ Display session expiration message */}
      {sessionMessage && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
          <p className="text-sm font-semibold">{sessionMessage}</p>
        </div>
      )}

      {/* Display error message */}
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
        disabled={isLoggingIn}
        className={submitBtn}
      >
        {isLoggingIn ? "Signing in..." : "Sign In"}
      </button>
      <button
  type="button"
  onClick={() => {
    window.location.href =
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/google`;
  }}
  className="w-full mt-4 flex items-center justify-center gap-3 border border-gray-300 rounded-2xl px-5 py-3 bg-white hover:bg-gray-50 transition"
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="google"
    className="w-5 h-5"
  />

  Continue with Google
</button>
    </form>
   
  </div>
);
}

export default SignIn;