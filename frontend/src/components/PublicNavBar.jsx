import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { primaryBtn } from "../styles/common";
import toast from "react-hot-toast";

function PublicNavBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const SignIn = () => {
    toast.success("Please Login to Create Resume");
    navigate("/signin");
    setOpen(false);
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-700 font-semibold"
      : "text-gray-700 hover:text-blue-700";

  return (
    <header className="bg-[#f4f8ff] border-b border-[#dbe7f7] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md">
              📄
            </div>

            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-[#1d1d1f]">
                ATS Resume Checker
              </h1>
              <p className="hidden sm:block text-sm text-[#6e6e73] mt-1">
                Make your resume ATS-friendly with premium AI guidance.
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden rounded-xl border border-blue-200 bg-white px-3 py-2 text-2xl text-blue-700 shadow-sm"
          >
            ☰
          </button>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-5">
              <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
              <li><NavLink to="/signup" className={linkClass}>Sign Up</NavLink></li>
              <li><NavLink to="/signin" className={linkClass}>Sign In</NavLink></li>
              <li>
                <button onClick={SignIn} className={primaryBtn}>
                  Create Resume
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {open && (
          <nav className="lg:hidden mt-4 rounded-2xl bg-white border border-[#dbe7f7] p-4 shadow-md">
            <ul className="flex flex-col gap-4">
              <li><NavLink to="/" onClick={() => setOpen(false)} className={linkClass}>Home</NavLink></li>
              <li><NavLink to="/signup" onClick={() => setOpen(false)} className={linkClass}>Sign Up</NavLink></li>
              <li><NavLink to="/signin" onClick={() => setOpen(false)} className={linkClass}>Sign In</NavLink></li>
              <li>
                <button onClick={SignIn} className={primaryBtn + " w-full"}>
                  Create Resume
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default PublicNavBar;