// App.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HostNavbar from "./components/HostNavbar";
import Dashboard from "./pages/Dashboard";
import CreateTournament from "./pages/CreateTournament";
import MyTournaments from "./pages/MyTournaments";
import Profile from "./pages/Profile";
import { useUser } from "../../context/UserContext";
import Loader from "../Loader";
import UnverifiedUser from "../UnverifiedUser";

export default function HostApp() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/access/hp-portal');
    }
  }, [loading, isAuthenticated, navigate]);

  const renderPage = () => {
    if (user && user.Verified === false) {
      return <UnverifiedUser />;
    } else {
      switch (activePage) {
        case "Dashboard":
          return <Dashboard />;
        case "Create Tournament":
          return <CreateTournament />;
        case "My Tournaments":
          return <MyTournaments />;
        case "Profile":
          return <Profile />;
        default:
          return <Dashboard />;
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#1B2430] via-[#212A37] to-[#0D1117]">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col w-full overflow-x-hidden">
        <HostNavbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-3 sm:p-4 md:p-6">{renderPage()}</main>
      </div>
    </div>
  );
}
