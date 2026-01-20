// App.jsx
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import HostNavbar from "./components/HostNavbar";
import Dashboard from "./pages/Dashboard";
import CreateTournament from "./pages/CreateTournament";
import MyTournaments from "./pages/MyTournaments";
import Profile from "./pages/Profile";
import { useUser } from "../../context/UserContext";
import Loader from "../Loader";

export default function HostApp() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated} = useUser(); // Assuming useAuth is a custom hook for authentication

  const renderPage = () => {
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
  };

  if(!isAuthenticated){
    return <Loader />;
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
