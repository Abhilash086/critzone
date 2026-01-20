import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateTemplate({ isOpen, onClose, onSave }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    console.log("Template Data:", data);
    onSave?.(data);
    reset();
    onClose();
  };

  const inputClass = (error) => 
    `w-full bg-[#0f1923] border ${error ? "border-red-500" : "border-gray-700"} text-white px-3 py-2 rounded-md focus:border-[#ff4655] focus:outline-none focus:ring-2 focus:ring-[#ff4655]/50 text-sm`;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1E2837] border border-[#2a2f3a] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#1E2837] border-b border-[#2a2f3a] p-4 sm:p-6 flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Create Tournament Template</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4">
            {/* Template Name */}
            <div>
              <label className="block text-sm mb-1 text-gray-300">Template Name *</label>
              <input
                type="text"
                placeholder="e.g., Squad Battle, Pro League"
                {...register("name", { required: "Template name is required" })}
                className={inputClass(errors.name)}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Game Name */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">Game *</label>
                <input
                  type="text"
                  placeholder="e.g., PUBG Mobile, Valorant"
                  {...register("game", { required: "Game is required" })}
                  className={inputClass(errors.game)}
                />
                {errors.game && <p className="text-red-500 text-xs mt-1">{errors.game.message}</p>}
              </div>

              {/* Game Mode */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">Game Mode *</label>
                <select {...register("gameMode", { required: "Game mode is required" })} className={inputClass(errors.gameMode)}>
                  <option value="">Select Mode</option>
                  <option value="solo">Solo</option>
                  <option value="duo">Duo</option>
                  <option value="squad">Squad</option>
                  <option value="team">Team</option>
                </select>
                {errors.gameMode && <p className="text-red-500 text-xs mt-1">{errors.gameMode.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Platform */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">Platform *</label>
                <select {...register("platform", { required: "Platform is required" })} className={inputClass(errors.platform)}>
                  <option value="">Select Platform</option>
                  <option value="pc">PC</option>
                  <option value="mobile">Mobile</option>
                  <option value="console">Console</option>
                  <option value="cross-platform">Cross-Platform</option>
                </select>
                {errors.platform && <p className="text-red-500 text-xs mt-1">{errors.platform.message}</p>}
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">Team Size</label>
                <input
                  type="number"
                  placeholder="e.g., 4"
                  {...register("teamSize", { min: { value: 1, message: "Minimum 1 player" }, valueAsNumber: true })}
                  className={inputClass(errors.teamSize)}
                />
                {errors.teamSize && <p className="text-red-500 text-xs mt-1">{errors.teamSize.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Number of Slots */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">Number of Slots *</label>
                <input
                  type="number"
                  placeholder="e.g., 100"
                  {...register("slots", { required: "Slots is required", min: { value: 2, message: "Minimum 2 slots" }, valueAsNumber: true })}
                  className={inputClass(errors.slots)}
                />
                {errors.slots && <p className="text-red-500 text-xs mt-1">{errors.slots.message}</p>}
              </div>

              {/* Entry Fee */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">Entry Fee (₹) *</label>
                <input
                  type="number"
                  placeholder="0 for free"
                  {...register("entryFee", { required: "Entry fee is required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                  className={inputClass(errors.entryFee)}
                />
                {errors.entryFee && <p className="text-red-500 text-xs mt-1">{errors.entryFee.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prize Pool */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">Prize Pool (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g., 10000"
                  {...register("prizePool", { required: "Prize pool is required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                  className={inputClass(errors.prizePool)}
                />
                {errors.prizePool && <p className="text-red-500 text-xs mt-1">{errors.prizePool.message}</p>}
              </div>

              {/* Contact Info */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">Contact Info</label>
                <input
                  type="text"
                  placeholder="Email or Phone"
                  {...register("contactInfo")}
                  className={inputClass(errors.contactInfo)}
                />
              </div>
            </div>

            {/* Rules */}
            <div>
              <label className="block text-sm mb-1 text-gray-300">Default Rules *</label>
              <textarea
                rows="4"
                placeholder="Standard tournament rules that will be used by default..."
                {...register("rules", { required: "Rules are required", minLength: { value: 20, message: "Min 20 characters" } })}
                className={inputClass(errors.rules)}
              />
              {errors.rules && <p className="text-red-500 text-xs mt-1">{errors.rules.message}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-700">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2.5 rounded-md text-sm font-semibold transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-[#ff4655] hover:bg-red-600 text-white py-2.5 rounded-md text-sm font-semibold transition-all"
              >
                Save Template
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
