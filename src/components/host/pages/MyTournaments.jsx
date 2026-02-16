import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Trophy, 
  Users, 
  Calendar, 
  Gamepad2, 
  Monitor, 
  Clock, 
  Edit3, 
  XOctagon, 
  ChevronRight,
  Swords,
  MoreVertical,
  CheckCircle
} from "lucide-react";
import TournamentDetailsModal from "../components/TournamentDetailsModal";
import EditTournamentModal from "../components/EditTournamentModal";
import { api } from "../../../services/api";
import toast from "react-hot-toast";
import Loader from "../../Loader";

export default function MyTournaments() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleViewDetails = (tournament) => {
    setSelectedTournament(tournament);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (tournament) => {
    setSelectedTournament(tournament);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await api.getTournaments();
      const tournamentsData = response.tournaments || [];
      
      // Map API response to component format
      const mappedTournaments = tournamentsData.map(tournament => {
        const tournamentDate = new Date(tournament.tournamentDate);
        if (tournament.tournamentTime) {
          const time = new Date(tournament.tournamentTime);
          tournamentDate.setHours(time.getHours());
          tournamentDate.setMinutes(time.getMinutes());
        }
        
        const registrationDeadline = new Date(tournament.registrationDate);
        if (tournament.registrationTime) {
           const time = new Date(tournament.registrationTime);
           registrationDeadline.setHours(time.getHours());
           registrationDeadline.setMinutes(time.getMinutes());
        }

        const now = new Date();
        
        // Determine status based on dates
        let status = "Active";
        if (tournamentDate < now) {
          status = "Completed";
        } else if (now < registrationDeadline) {
          status = "Active";
        }
        
        return {
          id: tournament._id,
          name: `${tournament.gameName} Tournament`,
          game: tournament.gameName,
          mode: tournament.gameMode.charAt(0).toUpperCase() + tournament.gameMode.slice(1),
          platform: tournament.platform.charAt(0).toUpperCase() + tournament.platform.slice(1),
          status: status,
          date: tournament.tournamentDate,
          participants: 0, // TODO: Get from API when available
          maxSlots: tournament.slots,
          prizePool: `₹${tournament.prizePool.toLocaleString()}`,
          // Keep original data for details modal
          ...tournament
        };
      });
      
      setTournaments(mappedTournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to load tournaments. Please try again."
      );
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (data) => {
    console.log('Saving tournament updates:', data);
    // TODO: Add API call to update tournament
  };

  const confirmAction = (message, onConfirm) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px]">
        <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
          {message}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-medium text-gray-800 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-3 py-1.5 text-xs font-medium text-white bg-[#ff4655] rounded-md hover:bg-red-600 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: {
        background: '#1E2837',
        border: '1px solid #2a2f3a',
        padding: '16px',
        color: '#fff',
      },
    });
  };

  const handleCancel = (tournament) => {
    confirmAction(
      `Are you sure you want to cancel "${tournament.name || tournament.gameName}"?`,
      async () => {
        // Optimistic update
        const previousStatus = tournament.status;
        setTournaments(prev => prev.map(t => 
          t.id === tournament.id ? { ...t, status: "Cancelled" } : t
        ));

        try {
          await api.updateTournamentStatus(tournament.id, "Cancelled");
          toast.success('Tournament cancelled successfully!');
        } catch (error) {
          // Rollback
          setTournaments(prev => prev.map(t => 
            t.id === tournament.id ? { ...t, status: previousStatus } : t
          ));
          console.error('Error cancelling tournament:', error);
          toast.error('Failed to cancel tournament');
        }
      }
    );
  };

  const handleComplete = (tournament) => {
    confirmAction(
      `Mark "${tournament.name}" as Completed? This cannot be undone.`,
      async () => {
        // Optimistic update
        const previousStatus = tournament.status;
        setTournaments(prev => prev.map(t => 
          t.id === tournament.id ? { ...t, status: "Completed" } : t
        ));

        try {
          await api.updateTournamentStatus(tournament.id, "Completed");
          toast.success('Tournament marked as Completed!');
        } catch (error) {
          // Rollback
          setTournaments(prev => prev.map(t => 
            t.id === tournament.id ? { ...t, status: previousStatus } : t
          ));
          console.error('Error completing tournament:', error);
          toast.error('Failed to update tournament status');
        }
      }
    );
  };

  const stats = {
    total: tournaments.length,
    active: tournaments.filter(t => t.status === "Active").length,
    completed: tournaments.filter(t => t.status === "Completed").length,
    cancelled: tournaments.filter(t => t.status === "Cancelled").length,
  };

  const filteredTournaments = filter === "All" ? tournaments : tournaments.filter(t => t.status === filter);

  const statusConfig = {
    Active: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", icon: "🟢" },
    Inactive: { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20", icon: "⚪" },
    Completed: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: "🔵" },
    Cancelled: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: "🔴" },
  };

  const handleToggleStatus = async (e, tournament) => {
    e.stopPropagation(); // Prevent card click
    const newStatus = tournament.status === "Active" ? "Inactive" : "Active";
    
    // Optimistic update
    setTournaments(prev => prev.map(t => 
      t.id === tournament.id ? { ...t, status: newStatus } : t
    ));
    
    try {
      await api.updateTournamentStatus(tournament.id, newStatus);
      toast.success(`Tournament marked as ${newStatus}`);
    } catch (error) {
       // Rollback on error
       setTournaments(prev => prev.map(t => 
        t.id === tournament.id ? { ...t, status: tournament.status } : t
      ));
       console.error("Error updating status:", error);
       toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full p-6 space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide uppercase font-[Rajdhani]">
            My Tournaments
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage and track your hosted events</p>
        </div>
        
        {/* Create Button could go here */}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: stats.total, color: "from-purple-500/20 to-blue-500/5", border: "border-purple-500/30", icon: Trophy },
          { label: "Active", value: stats.active, color: "from-green-500/20 to-emerald-500/5", border: "border-green-500/30", icon: Calendar },
          { label: "Completed", value: stats.completed, color: "from-blue-500/20 to-cyan-500/5", border: "border-blue-500/30", icon: CheckCircle }, // Assuming CheckCircle is imported or I can use another
          { label: "Cancelled", value: stats.cancelled, color: "from-red-500/20 to-orange-500/5", border: "border-red-500/30", icon: XOctagon },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -2 }}
            className={`relative overflow-hidden bg-gradient-to-br ${stat.color} border ${stat.border} rounded-xl p-4 backdrop-blur-sm group`}
          >
             <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon size={48} />
             </div>
             <div>
               <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{stat.label}</p>
               <p className="text-white text-3xl font-bold mt-1 font-[Rajdhani]">{stat.value}</p>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-4">
        {["All", "Active", "Completed", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`
              relative px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300
              ${filter === status 
                ? "text-white bg-[#ff4655] shadow-[0_0_15px_rgba(255,70,85,0.4)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }
            `}
          >
            {status}
            {filter === status && (
               <motion.div 
                 layoutId="activeFilter"
                 className="absolute inset-0 border border-white/20 rounded-lg pointer-events-none"
               />
            )}
          </button>
        ))}
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTournaments.map((tournament, i) => {
           const statusStyle = statusConfig[tournament.status] || statusConfig.Inactive;
           
           return (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-[#0f1923] border border-gray-800 hover:border-[#ff4655]/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff4655] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Card Header */}
              <div className="p-5 border-b border-gray-800/50 bg-[#16202c]">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center text-[#ff4655] shadow-lg">
                      <Gamepad2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight group-hover:text-[#ff4655] transition-colors line-clamp-1">
                        {tournament.name}
                      </h3>
                      <p className="text-gray-500 text-xs font-mono mt-0.5">{tournament.game}</p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                     {/* Toggle for Active/Inactive */}
                     {(tournament.status === "Active" || tournament.status === "Inactive") && (
                        <button 
                          onClick={(e) => handleToggleStatus(e, tournament)}
                          className={`
                            relative h-6 px-2 rounded-full flex items-center gap-1.5 transition-all
                            ${tournament.status === "Active" 
                              ? "bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20" 
                              : "bg-gray-500/10 border border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
                            }
                          `}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${tournament.status === "Active" ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
                          <span className="text-[10px] uppercase font-bold tracking-wider">{tournament.status}</span>
                        </button>
                     )}
                     
                     {/* Static badges for other statuses */}
                     {!(tournament.status === "Active" || tournament.status === "Inactive") && (
                        <div className={`px-2 py-1 rounded-md border text-[10px] uppercase font-bold tracking-wider ${statusStyle.bg} ${statusStyle.border} ${statusStyle.color}`}>
                          {tournament.status}
                        </div>
                     )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col gap-4">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div className="flex items-center gap-3 group/item">
                    <div className="p-2 rounded bg-gray-800/50 text-gray-400 group-hover/item:text-[#ff4655] transition-colors">
                      <Swords size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Mode</p>
                      <p className="text-gray-300 text-sm font-medium">{tournament.mode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 group/item">
                    <div className="p-2 rounded bg-gray-800/50 text-gray-400 group-hover/item:text-[#ff4655] transition-colors">
                      <Monitor size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Platform</p>
                      <p className="text-gray-300 text-sm font-medium">{tournament.platform}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group/item">
                    <div className="p-2 rounded bg-gray-800/50 text-gray-400 group-hover/item:text-[#ff4655] transition-colors">
                       <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Date</p>
                      <p className="text-gray-300 text-sm font-medium">
                        {new Date(tournament.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 group/item">
                    <div className="p-2 rounded bg-gray-800/50 text-gray-400 group-hover/item:text-[#ff4655] transition-colors">
                       <Trophy size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Prize Pool</p>
                      <p className="text-[#ff4655] text-sm font-bold glow-text">{tournament.prizePool}</p>
                    </div>
                  </div>
                </div>

                {/* Participants Progress */}
                <div className="mt-2 space-y-2">
                   <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Slots Filled</span>
                      <span className="text-white font-mono">{tournament.participants} <span className="text-gray-600">/</span> {tournament.maxSlots}</span>
                   </div>
                   <div className="h-2 w-full bg-gray-800 rounded-sm overflow-hidden relative">
                      {/* Background stripes */}
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
                      
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(tournament.participants / tournament.maxSlots) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full relative ${
                           (tournament.participants / tournament.maxSlots) >= 1 ? 'bg-red-500' : 'bg-[#ff4655]'
                        }`}
                      >
                         <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_white]"></div>
                      </motion.div>
                   </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-[#0a0f14] border-t border-gray-800 flex items-center gap-2">
                 <button 
                  onClick={() => handleViewDetails(tournament)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#ff4655] hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(255,70,85,0.4)] group-hover:translate-y-[-2px]"
                 >
                   <span>View Details</span>
                   <ChevronRight size={16} />
                 </button>
                 
                 {tournament.status === "Active" && (
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleComplete(tournament)}
                        className="p-2.5 bg-green-900/10 hover:bg-green-900/30 text-green-500 hover:text-green-400 border border-green-500/20 hover:border-green-500/50 rounded-lg transition-all"
                        title="Mark as Completed"
                       >
                         <CheckCircle size={18} />
                       </button>
                       <button 
                        onClick={() => handleEdit(tournament)}
                        className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors border border-transparent hover:border-gray-600"
                        title="Edit Tournament"
                       >
                         <Edit3 size={18} />
                       </button>
                       <button 
                        onClick={() => handleCancel(tournament)}
                        className="p-2.5 bg-red-900/10 hover:bg-red-900/30 text-red-500 hover:text-red-400 border border-red-500/20 hover:border-red-500/50 rounded-lg transition-all"
                        title="Cancel Tournament"
                       >
                         <XOctagon size={18} />
                       </button>
                    </div>
                 )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTournaments.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-[#1E2837]/30 to-transparent border border-gray-800 border-dashed rounded-xl"
        >
          <div className="p-4 bg-gray-800/50 rounded-full mb-4">
             <Trophy size={40} className="text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-300">No tournaments found</h3>
          <p className="text-gray-500 mt-2">There are no {filter.toLowerCase() === "all" ? "" : filter.toLowerCase()} tournaments to display.</p>
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
