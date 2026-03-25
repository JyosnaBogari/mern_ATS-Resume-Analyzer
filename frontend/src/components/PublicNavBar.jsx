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
        {/* Logo on the left */}
        {/* <img src="https://www.brandbucket.com/sites/default/files/logo_uploads/393341/stamped_preview_w7.png" width="50px" alt="logo" /> */}
          <h1 className={navBrandClass}>ATS Resume Checker</h1>
        {/* Links on the right */}
        <nav className={navLinksClass}>
          <ul className="flex items-center gap-7">
            <li>
              <NavLink to="" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="signup" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                SignUp
              </NavLink>
            </li>
            <li>
              <NavLink to="signin" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                SignIn
              </NavLink>
            </li>
            <li>
              <button onClick={SignIn} className={primaryBtn}>Create Resume</button>
            </li>
          </ul>
        </nav>
      </div>
     </div>
  )
}

export default PublicNavBar
