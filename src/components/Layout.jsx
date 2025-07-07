import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import "./componentsStyles/Layout.css";

export default function Layout() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <div className="layout-root">
      <Topbar toggleSidebar={toggleSidebar} />
      <div className="layout-content">
        <Sidebar
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          vendorDetails={vendorDetails}
        />

        <main className="main-content">
          <Outlet context={{ setVendorDetails }} />{" "}
        </main>
      </div>
    </div>
  );
}
