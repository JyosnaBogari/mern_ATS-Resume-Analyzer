
import {
  navbarClass,
  headingClass,
} from '../styles/common'
function DashboardHeader() {
  return (
     <div className={navbarClass}>
        {/* Logo on the left */}
        {/* <img src="https://www.brandbucket.com/sites/default/files/logo_uploads/393341/stamped_preview_w7.png" width="50px" alt="logo" /> */}
        <h1 className={headingClass}>ATS Resume Checker</h1>
      </div>
  ) 
}

export default DashboardHeader
