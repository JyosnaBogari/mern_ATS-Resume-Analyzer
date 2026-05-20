import { Outlet } from "react-router";
import DashboardHeader from "./DashnoardHeader";
import DashboardSidebar from "./DashboardSideBar";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fb]">

      {/* Header */}
      <DashboardHeader />

      {/* Body */}
<div className="flex flex-1 flex-col md:flex-row md:items-start bg-gradient-to-br from-[#eef6ff] via-[#f8fbff] to-[#dbeafe]">

        {/* Sidebar */}
        <DashboardSidebar />

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default DashboardLayout;