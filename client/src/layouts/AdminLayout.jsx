import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

/* =========================================
   ADMIN LAYOUT
========================================= */

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#05080d] text-white">

      {/* =========================================
          ADMIN SIDEBAR
      ========================================= */}

      <AdminSidebar />

      {/* =========================================
          MAIN CONTENT AREA
      ========================================= */}

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* =========================================
            BACKGROUND GLOWS
        ========================================= */}

        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/[0.04] blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-blue-600/[0.04] blur-3xl" />

        {/* =========================================
            ADMIN HEADER
        ========================================= */}

        <AdminNavbar />

        {/* =========================================
            ADMIN PAGE CONTENT
        ========================================= */}

        <main className="relative min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default AdminLayout;