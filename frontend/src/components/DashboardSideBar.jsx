import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import {
  navLinkActiveClass,
  navLinksClass,
  navLinkClass,
  primaryBtn,
  secondaryBtn
} from '../styles/common'

function DashboardSidebar() {
    const logout = useAuth(state => state.logout)
    const navigate = useNavigate();

    const SignOut = async () => {
        await logout()
        toast.success("Logged Out Successfully")
        navigate('/signin')
    }


    return (
        <div className="w-64 bg-[#f5f5f7] text-[#1d1d1f] flex flex-col p-4 gap-4 border-r border-[#d2d2d7]">
            <nav>
                <ul className="flex flex-col gap-4">
                <li>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass} >
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/upload-resume" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass} >
                        Upload Resume
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/create-resume" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                        Create Resume
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/history" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                        Resume History
                    </NavLink>
                </li>
                <li>
                    <button onClick={SignOut} className={secondaryBtn + " w-full text-left"}>
                        Logout
                    </button>
                </li>
                </ul>
            </nav>
        </div>
    );
}

export default DashboardSidebar;