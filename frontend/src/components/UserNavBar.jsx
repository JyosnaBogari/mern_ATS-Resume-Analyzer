import { NavLink } from 'react-router'
import {
  navBrandClass,
  navContainerClass,
  navLinkActiveClass,
  navbarClass,
  navLinksClass,
  navLinkClass,
  headingClass,
  navLinkActiveButtonClass
} from '../styles/common'

function UserNavBar() {
    
  return (
     <div className={navbarClass}>
      <div className={navContainerClass }>
        {/* Logo on the left */}
        {/* <img src="https://www.brandbucket.com/sites/default/files/logo_uploads/393341/stamped_preview_w7.png" width="50px" alt="logo" /> */}
          <h1 className={headingClass}>ATS Resume Checker</h1>
        {/* Links on the right */}
        <nav className={navLinksClass}>
          <ul className={navBrandClass + " flex gap-10"}>
            <li>
              <NavLink to="" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                UploadResume
              </NavLink>
            </li>
            <li>
              <NavLink to="create-resume" className={({ isActive }) => isActive ? navLinkActiveButtonClass : navLinkClass}>Create Resume</NavLink>
            </li>
          {/* here i can write button for logout */}
          {/* i can add the profile */}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default UserNavBar
