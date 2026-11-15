import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

/* =========================================
   ADMIN LAYOUT
========================================= */

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1220] text-white">

      {/* =========================================
          ADMIN SIDEBAR
      ========================================= */}

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* =========================================
          MAIN CONTENT AREA
      ========================================= */}

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">

        {/* =========================================
            BACKGROUND GLOWS
        ========================================= */}

        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/[0.04] blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-blue-600/[0.04] blur-3xl" />

        {/* =========================================
            ADMIN HEADER
        ========================================= */}

        <AdminNavbar onMenuClick={openSidebar} />

        {/* =========================================
            ADMIN PAGE CONTENT
        ========================================= */}

        <main className="relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default AdminLayout;