import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TournamentDetailsModal from "../components/TournamentDetailsModal";
import EditTournamentModal from "../components/EditTournamentModal";

export default function MyTournaments() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const handleViewDetails = (tournament) => {
    setSelectedTournament(tournament);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (tournament) => {
    setSelectedTournament(tournament);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (data) => {
    console.log('Saving tournament updates:', data);
    // TODO: Add API call to update tournament
  };

  const handleCancel = (tournament) => {
    if (window.confirm(`Are you sure you want to cancel "${tournament.name}"?`)) {
      console.log('Cancelling tournament:', tournament.id);
      // TODO: Add API call to cancel tournament
      alert('Tournament cancelled successfully!');
    }
  };

  const tournaments = [
    { id: 1, name: "Winter Valorant Championship", game: "Valorant", mode: "Squad", platform: "PC", status: "Active", date: "2026-02-15", participants: 64, maxSlots: 100, prizePool: "₹50,000" },
    { id: 2, name: "PUBG Mobile Showdown", game: "PUBG Mobile", mode: "Squad", platform: "Mobile", status: "Active", date: "2026-01-28", participants: 88, maxSlots: 100, prizePool: "₹25,000" },
    { id: 3, name: "CS:GO Pro League", game: "CS:GO", mode: "Team", platform: "PC", status: "Completed", date: "2025-12-20", participants: 32, maxSlots: 32, prizePool: "₹75,000" },
    { id: 4, name: "Free Fire Tournament", game: "Free Fire", mode: "Squad", platform: "Mobile", status: "Completed", date: "2025-11-15", participants: 50, maxSlots: 50, prizePool: "₹15,000" },
    { id: 5, name: "Apex Legends Clash", game: "Apex Legends", mode: "Team", platform: "Console", status: "Cancelled", date: "2025-10-30", participants: 12, maxSlots: 60, prizePool: "₹30,000" },
  ];

  const stats = {
    total: tournaments.length,
    active: tournaments.filter(t => t.status === "Active").length,
    completed: tournaments.filter(t => t.status === "Completed").length,
    cancelled: tournaments.filter(t => t.status === "Cancelled").length,
  };

  const filteredTournaments = filter === "All" ? tournaments : tournaments.filter(t => t.status === filter);

  const statusColor = {
    Active: "bg-green-500/10 text-green-400 border-green-500/30",
    Completed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    Cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  const StatCard = ({ label, value, color }) => (
    <motion.div whileHover={{ scale: 1.05 }} className={`bg-[#1E2837] border ${color} rounded-lg p-3 sm:p-4`}>
      <p className="text-gray-400 text-xs sm:text-sm">{label}</p>
      <p className="text-white text-xl sm:text-2xl font-bold mt-1">{value}</p>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white">
        My Tournaments
      </motion.h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Total" value={stats.total} color="border-[#ff4655]" />
        <StatCard label="Active" value={stats.active} color="border-green-500/30" />
        <StatCard label="Completed" value={stats.completed} color="border-blue-500/30" />
        <StatCard label="Cancelled" value={stats.cancelled} color="border-red-500/30" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {["All", "Active", "Completed", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              filter === status ? "bg-[#ff4655] text-white" : "bg-[#1E2837] text-gray-300 hover:bg-[#2a3441]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTournaments.map((tournament, i) => (
          <motion.div
            key={tournament.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 70, 85, 0.3)" }}
            className="bg-[#1E2837] border border-[#2a2f3a] rounded-lg p-4 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg mb-1">{tournament.name}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{tournament.game}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor[tournament.status]}`}>
                {tournament.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-gray-500 text-xs">Mode</p>
                <p className="text-white text-sm font-medium">{tournament.mode}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Platform</p>
                <p className="text-white text-sm font-medium">{tournament.platform}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Date</p>
                <p className="text-white text-sm font-medium">{new Date(tournament.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Prize Pool</p>
                <p className="text-[#ff4655] text-sm font-bold">{tournament.prizePool}</p>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Participants</span>
                <span>{tournament.participants} / {tournament.maxSlots}</span>
              </div>
              <div className="w-full bg-[#0f1923] rounded-full h-2">
                <div
                  className="bg-[#ff4655] h-2 rounded-full transition-all"
                  style={{ width: `${(tournament.participants / tournament.maxSlots) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleViewDetails(tournament)}
                className="flex-1 bg-[#ff4655] hover:bg-red-600 text-white py-2 rounded-md text-sm font-medium transition-all"
              >
                View Details
              </button>
              {tournament.status === "Active" && (
                <>
                  <button 
                    onClick={() => handleEdit(tournament)}
                    className="px-4 bg-[#0f1923] hover:bg-[#1a2332] text-white py-2 rounded-md text-sm font-medium transition-all border border-gray-700"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleCancel(tournament)}
                    className="px-4 bg-[#0f1923] hover:bg-red-900/30 text-red-400 py-2 rounded-md text-sm font-medium transition-all border border-red-500/30"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTournaments.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#1E2837] border border-[#2a2f3a] rounded-lg p-8 text-center">
          <p className="text-gray-400">No {filter.toLowerCase()} tournaments found.</p>
        </motion.div>
      )}

      {/* Tournament Details Modal */}
      <TournamentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        tournament={selectedTournament}
      />

      {/* Edit Tournament Modal */}
      <EditTournamentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        tournament={selectedTournament}
        onSave={handleSaveEdit}
      />
    </motion.div>
  );
}
