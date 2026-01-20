import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateTournament() {
  const location = useLocation();
  const editMode = location.state?.editMode || false;
  const existingTournament = location.state?.tournament || null;
  
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const tournamentDate = watch("tournamentDate");
  const tournamentTime = watch("tournamentTime");

  useEffect(() => {
    // Load templates from localStorage
    const savedTemplates = localStorage.getItem('tournamentTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }

    // If in edit mode, pre-fill form with existing tournament data
    if (editMode && existingTournament) {
      reset({
        gameName: existingTournament.game || '',
        gameMode: existingTournament.mode || '',
        platform: existingTournament.platform || '',
        slots: existingTournament.maxSlots || '',
        prizePool: existingTournament.prizePool?.replace(/[^0-9]/g, '') || '',
        // Add other fields as needed
      });
    }
  }, [editMode, existingTournament, reset]);

  const loadTemplate = (template) => {
    // Pre-fill form with template data
    reset({
      gameName: template.game || '',
      gameMode: template.gameMode || '',
      platform: template.platform || '',
      teamSize: template.teamSize || '',
      slots: template.slots || '',
      entryFee: template.entryFee || '',
      prizePool: template.prizePool || '',
      contactInfo: template.contactInfo || '',
      rules: template.rules || '',
    });
    setIsTemplateModalOpen(false);
    alert(`Template "${template.name}" loaded successfully!`);
  };

  const onSubmit = async (data) => {
    console.log(editMode ? "Updating Tournament:" : "Creating Tournament:", data);
    if (editMode) {
      alert(`Tournament "${existingTournament.name}" updated successfully!`);
      // TODO: Add API call to update tournament
    } else {
      alert(`Tournament for ${data.gameName} created successfully!`);
      // TODO: Add API call to create tournament
    }
  };

  const inputClass = (error) =>
    `w-full bg-[#0f1923] border ${error ? "border-red-500" : "border-gray-700"} text-white px-3 py-2 rounded-md focus:border-[#ff4655] focus:outline-none focus:ring-2 focus:ring-[#ff4655]/50 text-sm [color-scheme:dark]`;

  const Field = ({ label, error, children }) => (
    <div>
      <label className="block text-xs sm:text-sm mb-1 text-gray-300">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white"
      >
        {editMode ? 'Edit Tournament' : 'Create Tournament'}
      </motion.h1>

      {/* Load from Template Button */}
      {!editMode && templates.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          type="button"
          onClick={() => setIsTemplateModalOpen(true)}
          className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all text-sm font-medium"
        >
          📋 Load from Template
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-[#1E2837] border border-[#2a2f3a] rounded-lg shadow-lg p-4 sm:p-6"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4"
        >
          <Field label="Game Name *" error={errors.gameName}>
            <input
              type="text"
              placeholder="e.g., PUBG Mobile, Valorant"
              {...register("gameName", { required: "Game name is required" })}
              className={inputClass(errors.gameName)}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Field label="Game Mode *" error={errors.gameMode}>
              <select
                {...register("gameMode", { required: "Game mode is required" })}
                className={inputClass(errors.gameMode)}
              >
                <option value="">Select Mode</option>
                <option value="solo">Solo</option>
                <option value="duo">Duo</option>
                <option value="squad">Squad</option>
                <option value="team">Team</option>
              </select>
            </Field>
            <Field label="Platform *" error={errors.platform}>
              <select
                {...register("platform", { required: "Platform is required" })}
                className={inputClass(errors.platform)}
              >
                <option value="">Select Platform</option>
                <option value="pc">PC</option>
                <option value="mobile">Mobile</option>
                <option value="console">Console</option>
                <option value="cross-platform">Cross-Platform</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm mb-1 text-gray-300">Tournament Date *</label>
              <div className="grid grid-cols-2 gap-2">
                <Field error={errors.tournamentDate}>
                  <Controller
                    control={control}
                    name="tournamentDate"
                    rules={{
                      required: "Date is required",
                      validate: (v) =>
                        v > new Date() || "Must be in the future",
                    }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select date"
                        className={inputClass(errors.tournamentDate)}
                        minDate={new Date()}
                        wrapperClassName="w-full"
                      />
                    )}
                  />
                </Field>
                <Field error={errors.tournamentTime}>
                  <Controller
                    control={control}
                    name="tournamentTime"
                    rules={{ required: "Time is required" }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeFormat="h:mm aa"
                        timeIntervals={15}
                        dateFormat="h:mm aa"
                        placeholderText="Time"
                        className={inputClass(errors.tournamentTime)}
                        wrapperClassName="w-full"
                      />
                    )}
                  />
                </Field>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm mb-1 text-gray-300">Registration Deadline *</label>
              <div className="grid grid-cols-2 gap-2">
                <Field error={errors.registrationDate}>
                  <Controller
                    control={control}
                    name="registrationDate"
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select date"
                        className={inputClass(errors.registrationDate)}
                        minDate={new Date()}
                        wrapperClassName="w-full"
                      />
                    )}
                  />
                </Field>
                <Field error={errors.registrationTime}>
                  <Controller
                    control={control}
                    name="registrationTime"
                    rules={{ required: "Time is required" }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeFormat="h:mm aa"
                        timeIntervals={15}
                        dateFormat="h:mm aa"
                        placeholderText="Time"
                        className={inputClass(errors.registrationTime)}
                        wrapperClassName="w-full"
                      />
                    )}
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Field label="Number of Slots *" error={errors.slots}>
              <input
                type="number"
                placeholder="e.g., 100"
                {...register("slots", {
                  required: "Number of slots is required",
                  min: { value: 2, message: "Minimum 2 slots" },
                  valueAsNumber: true,
                })}
                className={inputClass(errors.slots)}
              />
            </Field>
            <Field label="Team Size" error={errors.teamSize}>
              <input
                type="number"
                placeholder="e.g., 4"
                {...register("teamSize", {
                  min: { value: 1, message: "Minimum 1 player" },
                  valueAsNumber: true,
                })}
                className={inputClass(errors.teamSize)}
              />
            </Field>
          </div>

          <div className="border-t border-gray-700 pt-3 sm:pt-4">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-3">
              Prize Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <Field label="Entry Fee (₹)" error={errors.entryFee}>
                <input
                  type="number"
                  placeholder="0 for free"
                  {...register("entryFee", { min: 0, valueAsNumber: true })}
                  className={inputClass(errors.entryFee)}
                />
              </Field>
              <Field label="Total Prize Pool (₹) *" error={errors.prizePool}>
                <input
                  type="number"
                  placeholder="e.g., 10000"
                  {...register("prizePool", {
                    required: "Prize pool is required",
                    min: 0,
                    valueAsNumber: true,
                  })}
                  className={inputClass(errors.prizePool)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-3">
              <Field label="1st Prize (₹)" error={errors.firstPrize}>
                <input
                  type="number"
                  placeholder="e.g., 5000"
                  {...register("firstPrize", { min: 0, valueAsNumber: true })}
                  className={inputClass(errors.firstPrize)}
                />
              </Field>
              <Field label="2nd Prize (₹)" error={errors.secondPrize}>
                <input
                  type="number"
                  placeholder="e.g., 3000"
                  {...register("secondPrize", { min: 0, valueAsNumber: true })}
                  className={inputClass(errors.secondPrize)}
                />
              </Field>
              <Field label="3rd Prize (₹)" error={errors.thirdPrize}>
                <input
                  type="number"
                  placeholder="e.g., 2000"
                  {...register("thirdPrize", { min: 0, valueAsNumber: true })}
                  className={inputClass(errors.thirdPrize)}
                />
              </Field>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3 sm:pt-4">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-3">
              Contact & Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <Field label="Contact Info *" error={errors.contactInfo}>
                <input
                  type="text"
                  placeholder="Email or Phone"
                  {...register("contactInfo", {
                    required: "Contact info is required",
                  })}
                  className={inputClass(errors.contactInfo)}
                />
              </Field>
              <Field label="Stream Link" error={errors.streamLink}>
                <input
                  type="url"
                  placeholder="YouTube/Twitch URL"
                  {...register("streamLink", {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Invalid URL",
                    },
                  })}
                  className={inputClass(errors.streamLink)}
                />
              </Field>
              <Field label="Discord Link" error={errors.discordLink}>
                <input
                  type="url"
                  placeholder="Discord Server URL"
                  {...register("discordLink", {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Invalid URL",
                    },
                  })}
                  className={inputClass(errors.discordLink)}
                />
              </Field>
            </div>
          </div>

          <Field label="Rules & Description *" error={errors.rules}>
            <textarea
              rows="5"
              placeholder="Describe tournament rules, format details, scoring system, restrictions, etc."
              {...register("rules", {
                required: "Rules are required",
                minLength: { value: 20, message: "Min 20 characters" },
              })}
              className={inputClass(errors.rules)}
            />
          </Field>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className={`w-full ${isSubmitting ? "bg-gray-600 cursor-not-allowed" : "bg-[#ff4655] hover:bg-red-600"} text-white py-2 sm:py-2.5 rounded-md transition-all shadow-md text-sm sm:text-base font-semibold`}
          >
            {isSubmitting 
              ? (editMode ? "Updating..." : "Creating...") 
              : (editMode ? "Update Tournament" : "Create Tournament")
            }
          </motion.button>
        </form>
      </motion.div>

      {/* Template Selection Modal */}
      <AnimatePresence>
        {isTemplateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsTemplateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1E2837] rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Select a Template</h2>
                <button
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              {templates.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No templates available. Create one from the Dashboard!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => loadTemplate(template)}
                      className="bg-[#0f1923] border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-[#ff4655] transition-all"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300"><span className="text-gray-500">Game:</span> {template.game}</p>
                        <p className="text-gray-300"><span className="text-gray-500">Mode:</span> {template.gameMode}</p>
                        <p className="text-gray-300"><span className="text-gray-500">Platform:</span> {template.platform}</p>
                        <div className="flex justify-between mt-2 pt-2 border-t border-gray-700">
                          <span className="text-gray-400">Team Size: {template.teamSize}</span>
                          <span className="text-gray-400">Slots: {template.slots}</span>
                        </div>
                        {template.prizePool && (
                          <p className="text-[#ff4655] font-semibold mt-2">Prize: ₹{template.prizePool}</p>
                        )}
                        {template.uses && (
                          <p className="text-xs text-gray-500 mt-2">Used {template.uses} times</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
