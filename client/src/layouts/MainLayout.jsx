import { Outlet } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

      {/* =========================================
          NAVBAR
      ========================================= */}

      <Navbar />

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* =========================================
          FOOTER
      ========================================= */}

      <Footer />

    </div>
  );
};

export default MainLayout;