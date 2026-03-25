import { Outlet } from "react-router";
import DashboardHeader from "./DashnoardHeader";
import DashboardSidebar from "./DashboardSideBar";

function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen">

      {/* Header */}
      <DashboardHeader />

      {/* Body */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <DashboardSidebar/>

        {/* Page Content */}
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default DashboardLayout;