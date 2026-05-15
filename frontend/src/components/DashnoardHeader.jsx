
import {
  navbarClass,
  headingClass,
} from '../styles/common'
function DashboardHeader() {
  return (
     <div className={navbarClass}>
       <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
         <div>
           <h1 className={headingClass + " text-lg sm:text-2xl"}>ATS Resume Checker</h1>
           <p className="text-sm text-[#6e6e73] mt-1">Premium resume tools for ATS-ready candidates.</p>
         </div>
         <div className="hidden md:block text-sm text-[#6e6e73]">Manage uploads, create resumes, and review analysis in one place.</div>
       </div>
      </div>
  ) 
}

export default DashboardHeader
