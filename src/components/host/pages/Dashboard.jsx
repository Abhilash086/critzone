import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CreateTemplate from "../components/CreateTemplate";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // Load templates from localStorage
    const savedTemplates = localStorage.getItem('tournamentTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, [isCreateTemplateOpen]); // Reload when modal closes

  const handleSaveTemplate = (templateData) => {
    // Load existing templates
    const savedTemplates = localStorage.getItem('tournamentTemplates');
    const templates = savedTemplates ? JSON.parse(savedTemplates) : [];
    
    // Add new template with metadata
    const newTemplate = {
      ...templateData,
      createdAt: new Date().toISOString(),
      uses: 0
    };
    templates.push(newTemplate);
    
    // Save to localStorage
    localStorage.setItem('tournamentTemplates', JSON.stringify(templates));
    
    alert(`Template "${templateData.name}" saved successfully!`);
  };

  const stats = [
    { title: "Total Tournaments", value: 12, color: "border-[#ff4655]", icon: "🏆" },
    { title: "Active", value: 4, color: "border-green-500/30", icon: "⚡" },
    { title: "Completed", value: 6, color: "border-blue-500/30", icon: "✓" },
    { title: "Cancelled", value: 2, color: "border-red-500/30", icon: "✕" },
  ];

  const upcomingTournaments = [
    { id: 1, name: "Winter Valorant Championship", game: "Valorant", date: "2026-02-15", time: "6:00 PM", participants: 64, maxSlots: 100 },
    { id: 2, name: "PUBG Mobile Showdown", game: "PUBG Mobile", date: "2026-01-28", time: "4:00 PM", participants: 88, maxSlots: 100 },
    { id: 3, name: "CS:GO Weekend Cup", game: "CS:GO", date: "2026-02-05", time: "8:00 PM", participants: 28, maxSlots: 64 },
  ];

  const quickStats = [
    { label: "Participants Joined", value: "2,456", icon: "👥", change: "+12%", trend: "up" },
    { label: "Success Rate", value: "94%", icon: "📈", change: "+3%", trend: "up" },
    { label: "Avg Team Size", value: "4.2", icon: "🎮", change: "±0", trend: "neutral" },
    { label: "Prizes Distributed", value: "₹2.5M", icon: "💰", change: "+18%", trend: "up" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white">
        Dashboard Overview
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-[#1E2837] border ${stat.color} p-4 rounded-lg cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.1, type: "spring" }} className="text-2xl sm:text-3xl font-bold text-white">
                {stat.value}
              </motion.p>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Performance Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-[#1E2837] border border-[#2a2f3a] rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{stat.icon}</span>
                <span className={`text-xs font-semibold ${stat.trend === "up" ? "text-green-400" : stat.trend === "down" ? "text-red-400" : "text-gray-400"}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-gray-400 text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Tournament Templates */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-[#1E2837] border border-[#2a2f3a] rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Tournament Templates</h2>
            <span className="text-xs text-gray-400">📋 {templates.length}</span>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {templates.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No templates yet. Create your first one!</p>
            ) : (
              templates.map((template, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  whileHover={{ backgroundColor: "#151b26", scale: 1.02 }}
                  className="bg-[#0f1923] p-3 rounded-lg cursor-pointer border border-gray-700/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-medium text-sm">{template.name}</h3>
                      <p className="text-gray-400 text-xs">{template.game}</p>
                    </div>
                    <span className="text-[#ff4655] text-xs font-semibold">{template.uses || 0}× used</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>🎯 {template.slots} slots</span>
                    <span>💵 ₹{template.entryFee} fee</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateTemplateOpen(true)}
            className="w-full bg-[#ff4655] hover:bg-red-600 text-white py-2 rounded-md text-sm font-medium transition-all mt-3"
          >
            + Create Template
          </motion.button>
        </motion.div>

        {/* Upcoming Tournaments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="bg-[#1E2837] border border-[#2a2f3a] rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming Tournaments</h2>
          <div className="space-y-3">
            {upcomingTournaments.map((tournament) => (
              <motion.div
                key={tournament.id}
                whileHover={{ backgroundColor: "#151b26" }}
                className="bg-[#0f1923] p-3 rounded-lg cursor-pointer border border-gray-700/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-medium text-sm">{tournament.name}</h3>
                    <p className="text-gray-400 text-xs">{tournament.game}</p>
                  </div>
                  <span className="text-[#ff4655] text-xs font-semibold">{tournament.date}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>🕐 {tournament.time}</span>
                  <span>{tournament.participants}/{tournament.maxSlots} Players</span>
                </div>
                <div className="w-full bg-[#1E2837] rounded-full h-1.5 mt-2">
                  <div className="bg-[#ff4655] h-1.5 rounded-full" style={{ width: `${(tournament.participants / tournament.maxSlots) * 100}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Create Template Modal */}
      <CreateTemplate
        isOpen={isCreateTemplateOpen}
        onClose={() => setIsCreateTemplateOpen(false)}
        onSave={handleSaveTemplate}
      />
    </motion.div>
  );
}
