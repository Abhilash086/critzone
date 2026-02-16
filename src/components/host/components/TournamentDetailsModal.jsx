import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateIST, formatTimeIST } from "../../../utils/dateUtils";

export default function TournamentDetailsModal({ isOpen, onClose, tournament }) {
  if (!tournament) return null;

  const statusColor = {
    Active: "bg-green-500/20 text-green-400 border-green-500/50",
    Completed: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    Cancelled: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1E2837] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#1E2837] border-b border-gray-700 p-6 flex justify-between items-start z-10">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{tournament.gameName}</h2>
                <div className="flex gap-3 items-center">
                  <span className="text-gray-400 text-sm">{tournament.gameMode}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor[tournament.status] || "bg-gray-500/20 text-gray-400 border-gray-500/50"}`}>
                    {tournament.status}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0f1923] border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Date</p>
                  <p className="text-white font-semibold">
                    {tournament.tournamentDate ? formatDateIST(tournament.tournamentDate) : "TBD"}
                  </p>
                </div>
                <div className="bg-[#0f1923] border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Time</p>
                  <p className="text-white font-semibold">
                    {tournament.tournamentTime ? formatTimeIST(tournament.tournamentTime) : "TBD"}
                  </p>
                </div>
                <div className="bg-[#0f1923] border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Platform</p>
                  <p className="text-white font-semibold">{tournament.platform}</p>
                </div>
                <div className="bg-[#0f1923] border border-[#ff4655]/30 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Prize Pool</p>
                  <p className="text-[#ff4655] font-bold">₹{tournament.prizePool}</p>
                </div>
              </div>

              {/* Tournament Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0f1923] border border-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>📋</span> Tournament Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tournament ID:</span>
                      <span className="text-white font-mono text-xs">#{tournament._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Game Mode:</span>
                      <span className="text-white">{tournament.gameMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Team Size:</span>
                      <span className="text-white">{tournament.teamSize} vs {tournament.teamSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Slots:</span>
                      <span className="text-white">{tournament.slots}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entry Fee:</span>
                      <span className="text-white">{tournament.entryFee === 0 ? "Free" : `₹${tournament.entryFee}`}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f1923] border border-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>💰</span> Prize Distribution
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Prize Pool:</span>
                      <span className="text-[#ff4655] font-bold">₹{tournament.prizePool}</span>
                    </div>
                    {tournament.firstPrize && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">1st Place:</span>
                        <span className="text-yellow-400 font-semibold">🥇 ₹{tournament.firstPrize}</span>
                      </div>
                    )}
                    {tournament.secondPrize && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">2nd Place:</span>
                        <span className="text-gray-300 font-semibold">🥈 ₹{tournament.secondPrize}</span>
                      </div>
                    )}
                    {tournament.thirdPrize && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">3rd Place:</span>
                        <span className="text-orange-400 font-semibold">🥉 ₹{tournament.thirdPrize}</span>
                      </div>
                    )}
                    {!tournament.firstPrize && !tournament.secondPrize && !tournament.thirdPrize && (
                         <div className="text-gray-500 text-center py-2 italic">
                            Prize distribution details not available
                         </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Details: Rules & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0f1923] border border-gray-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <span>📜</span> Rules
                    </h3>
                    <div className="text-gray-300 text-sm max-h-32 overflow-y-auto pr-2">
                        {tournament.rules || "No specific rules provided."}
                    </div>
                  </div>

                  <div className="bg-[#0f1923] border border-gray-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <span>🔗</span> Contact & Links
                    </h3>
                    <div className="space-y-3 text-sm">
                        {tournament.contactInfo && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Contact:</span>
                                <span className="text-white">{tournament.contactInfo}</span>
                            </div>
                        )}
                         {tournament.discordLink && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Discord:</span>
                                <a href={tournament.discordLink} target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:underline truncate max-w-[200px]">
                                    {tournament.discordLink}
                                </a>
                            </div>
                        )}
                        {tournament.streamLink && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Stream:</span>
                                <a href={tournament.streamLink} target="_blank" rel="noopener noreferrer" className="text-[#9146FF] hover:underline truncate max-w-[200px]">
                                    {tournament.streamLink}
                                </a>
                            </div>
                        )}
                        {!tournament.contactInfo && !tournament.discordLink && !tournament.streamLink && (
                            <p className="text-gray-500 italic">No contact or links provided.</p>
                        )}
                    </div>
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button className="flex-1 bg-[#ff4655] hover:bg-red-600 text-white py-2.5 rounded-md font-semibold transition-all">
                  View Participants
                </button>
                {tournament.status === "Active" && (
                  <button className="px-6 bg-[#0f1923] hover:bg-[#1a2332] text-white py-2.5 rounded-md font-semibold transition-all border border-gray-700">
                    Manage Tournament
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
