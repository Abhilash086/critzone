import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
                <h2 className="text-2xl font-bold text-white mb-2">{tournament.name}</h2>
                <div className="flex gap-3 items-center">
                  <span className="text-gray-400 text-sm">{tournament.game}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor[tournament.status]}`}>
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
                  <p className="text-white font-semibold">{tournament.date}</p>
                </div>
                <div className="bg-[#0f1923] border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Mode</p>
                  <p className="text-white font-semibold">{tournament.mode}</p>
                </div>
                <div className="bg-[#0f1923] border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Platform</p>
                  <p className="text-white font-semibold">{tournament.platform}</p>
                </div>
                <div className="bg-[#0f1923] border border-[#ff4655]/30 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Prize Pool</p>
                  <p className="text-[#ff4655] font-bold">{tournament.prizePool}</p>
                </div>
              </div>

              {/* Participants Progress */}
              <div className="bg-[#0f1923] border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-semibold">Participants</h3>
                  <span className="text-gray-400 text-sm">{tournament.participants} / {tournament.maxSlots}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#ff4655] to-pink-500 h-3 rounded-full transition-all"
                    style={{ width: `${(tournament.participants / tournament.maxSlots) * 100}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {tournament.maxSlots - tournament.participants} slots remaining
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
                      <span className="text-white font-mono">#{tournament.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Game Mode:</span>
                      <span className="text-white">{tournament.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform:</span>
                      <span className="text-white">{tournament.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Slots:</span>
                      <span className="text-white">{tournament.maxSlots}</span>
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
                      <span className="text-[#ff4655] font-bold">{tournament.prizePool}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">1st Place:</span>
                      <span className="text-yellow-400 font-semibold">🥇 50%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">2nd Place:</span>
                      <span className="text-gray-300 font-semibold">🥈 30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">3rd Place:</span>
                      <span className="text-orange-400 font-semibold">🥉 20%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Participants */}
              <div className="bg-[#0f1923] border border-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span>👥</span> Recent Registrations
                </h3>
                <div className="space-y-2">
                  {[
                    { name: "ProGamer_X", team: "Team Alpha", time: "2 hours ago" },
                    { name: "eSports_King", team: "Solo", time: "5 hours ago" },
                    { name: "NightRider", team: "Team Phoenix", time: "1 day ago" },
                    { name: "ShadowStrike", team: "Team Beta", time: "1 day ago" },
                  ].map((participant, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex justify-between items-center p-2 hover:bg-[#1a2332] rounded transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#ff4655] to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {participant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{participant.name}</p>
                          <p className="text-gray-500 text-xs">{participant.team}</p>
                        </div>
                      </div>
                      <span className="text-gray-400 text-xs">{participant.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button className="flex-1 bg-[#ff4655] hover:bg-red-600 text-white py-2.5 rounded-md font-semibold transition-all">
                  View Full Participant List
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
