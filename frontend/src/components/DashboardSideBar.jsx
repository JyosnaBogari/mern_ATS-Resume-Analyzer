import { useState } from "react";
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
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const SignOut = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            toast.success("Logged Out Successfully");
            navigate('/signin');
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        } finally {
            setIsLoggingOut(false);
        }
    }


    return (
        <div className="w-full md:w-72 bg-white text-[#1d1d1f] flex flex-col p-5 gap-5 border-r border-[#e8ebf2] shadow-sm md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-y-auto">
      <div className="rounded-3xl bg-[#f8f9fb] p-4 text-center">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">Dashboard Menu</h2>
      </div>
      <nav>
        <ul className="flex flex-col gap-3">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${navLinkActiveClass} block rounded-2xl px-4 py-3 bg-[#eaf3ff]` : `${navLinkClass} block rounded-2xl px-4 py-3 hover:bg-[#f4f7fb]`}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/upload-resume" className={({ isActive }) => isActive ? `${navLinkActiveClass} block rounded-2xl px-4 py-3 bg-[#eaf3ff]` : `${navLinkClass} block rounded-2xl px-4 py-3 hover:bg-[#f4f7fb]`}>
              Upload Resume
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/create-resume" className={({ isActive }) => isActive ? `${navLinkActiveClass} block rounded-2xl px-4 py-3 bg-[#eaf3ff]` : `${navLinkClass} block rounded-2xl px-4 py-3 hover:bg-[#f4f7fb]`}>
              Create Resume
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/history" className={({ isActive }) => isActive ? `${navLinkActiveClass} block rounded-2xl px-4 py-3 bg-[#eaf3ff]` : `${navLinkClass} block rounded-2xl px-4 py-3 hover:bg-[#f4f7fb]`}>
              Resume History
            </NavLink>
          </li>
          <li>
            <button onClick={SignOut} disabled={isLoggingOut} className={secondaryBtn + " w-full text-left"}>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </li>
        </ul>
      </nav>
    </div>
    );
}

export default DashboardSidebar;