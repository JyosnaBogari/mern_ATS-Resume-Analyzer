import { NavLink } from 'react-router'
import {
  navBrandClass,
  navContainerClass,
  navLinkActiveClass,
  navbarClass,
  navLinksClass,
  navLinkClass,
  headingClass,
  primaryBtn
} from '../styles/common'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
function PublicNavBar() {
   const login=useAuth(state=>state.login)
   const navigate=useNavigate();

    const SignIn=()=>{
       toast.success("Please Login to Create Resume")
       navigate('/signin')
    }
  return (
     <div className={navbarClass}>
      <div className={navContainerClass }>
          <div>
            <h1 className={navBrandClass}>ATS Resume Checker</h1>
            <p className="text-sm text-[#6e6e73] mt-1 hidden sm:block">Make your resume ATS-friendly with premium AI guidance.</p>
          </div>
        <nav className={navLinksClass}>
          <ul className="flex flex-wrap items-center gap-3">
            <li>
              <NavLink to="" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="signup" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                Sign Up
              </NavLink>
            </li>
            <li>
              <NavLink to="signin" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                Sign In
              </NavLink>
            </li>
            <li>
              <button onClick={SignIn} className={primaryBtn}>
                Create Resume
              </button>
            </li>
          </ul>
        </nav>
      </div>
     </div>
  )
}

export default PublicNavBar
