import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "../../../services/api";
import toast from "react-hot-toast";

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

export default function CreateTournament() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);

  const steps = [
    { id: 1, title: "Basic Info", icon: "📝" },
    { id: 2, title: "Match Settings", icon: "⚙️" },
    { id: 3, title: "Entry & Prize", icon: "💰" },
    { id: 4, title: "Review & Publish", icon: "🚀" },
  ];

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));


  
  const {
    register,
    handleSubmit,
    control,
    reset,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const loadTemplate = (template) => {
    // Pre-fill form with template data
    reset({
      tournamentName: template.name || '',
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

  const currentValues = getValues();

  const handleNext = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['tournamentName', 'gameName', 'status', 'gameMode', 'platform'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['tournamentDate', 'tournamentTime', 'registrationDate', 'registrationTime', 'slots', 'teamSize'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['entryFee', 'prizePool'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      nextStep();
    }
  };

  const onSubmit = async (data) => {
    try {
      // Prepare payload
      const payload = {
        name: data.tournamentName,
        gameName: data.gameName,
        gameMode: data.gameMode,
        platform: data.platform,
        status: data.status,
        tournamentDate: data.tournamentDate,
        tournamentTime: data.tournamentTime,
        registrationDate: data.registrationDate,
        registrationTime: data.registrationTime,
        slots: data.slots,
        teamSize: data.teamSize || null,
        entryFee: data.entryFee || 0,
        prizePool: data.prizePool,
        firstPrize: data.firstPrize || null,
        secondPrize: data.secondPrize || null,
        thirdPrize: data.thirdPrize || null,
        contactInfo: data.contactInfo,
        streamLink: data.streamLink || null,
        discordLink: data.discordLink || null,
        rules: data.rules,
      };

      console.log("Creating Tournament with payload:", payload);

      await api.createTournament(payload);
      toast.success(`Tournament "${data.tournamentName}" created successfully!`, {
        duration: 4000,
      });
      reset();
      setCurrentStep(1);

    } catch (error) {
      console.error("Error creating tournament:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create tournament. Please try again."
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-2xl font-semibold text-white"
        >
          Create Tournament
        </motion.h1>

        {/* Step Indicator */}
        <div className="flex items-center gap-1 sm:gap-2 bg-[#1E2837] p-1.5 sm:p-2 rounded-lg border border-[#2a2f3a] overflow-x-auto max-w-full">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentStep === step.id
                  ? "bg-[#ff4655] text-white"
                  : currentStep > step.id
                  ? "text-[#ff4655]"
                  : "text-gray-500"
              }`}
            >
              <span className="text-sm sm:text-lg">{step.icon}</span>
              <span className={`text-xs sm:text-sm font-medium ${
                currentStep === step.id ? "block" : "hidden sm:block"
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Load from Template Button - Show only on Step 1 */}
      {currentStep === 1 && templates.length > 0 && (
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-4">
                <Field label="Tournament Name *" error={errors.tournamentName}>
                  <input
                    type="text"
                    placeholder="e.g., Summer Championship 2026"
                    {...register("tournamentName", { required: "Name is required" })}
                    className={inputClass(errors.tournamentName)}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Game *" error={errors.gameName}>
                    <input
                      type="text"
                      placeholder="e.g., PUBG Mobile"
                      {...register("gameName", { required: "Game name is required" })}
                      className={inputClass(errors.gameName)}
                    />
                  </Field>
                  <Field label="Status" error={errors.status}>
                  <select
                    {...register("status")}
                    defaultValue="Active"
                    className={inputClass(errors.status)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </motion.div>
          )}

          {/* Step 2: Match Settings */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">Tournament Date *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Field error={errors.tournamentDate}>
                      <Controller
                        control={control}
                        name="tournamentDate"
                        rules={{ required: "Date is required" }}
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat="MMM d, yyyy"
                            placeholderText="Date"
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
                  <label className="block text-sm mb-1 text-gray-300">Registration Deadline *</label>
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
                            dateFormat="MMM d, yyyy"
                            placeholderText="Date"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Slots (Team Limit) *" error={errors.slots}>
                  <input
                    type="number"
                    placeholder="e.g., 100"
                    {...register("slots", {
                      required: "Slots required",
                      min: { value: 2, message: "Min 2 slots" },
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
                      min: { value: 1, message: "Min 1 player" },
                      valueAsNumber: true,
                    })}
                    className={inputClass(errors.teamSize)}
                  />
                </Field>
              </div>
            </motion.div>
          )}

          {/* Step 3: Entry & Prize */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-white mb-3">Prize Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </motion.div>
          )}

          {/* Step 4: Review & Publish + Links */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Additional Contact/Links Fields */}
              <div className="border-b border-gray-700 pb-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Final Details</h3>
                <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Contact Info *" error={errors.contactInfo}>
                      <input
                        type="text"
                        placeholder="Email or Phone"
                        {...register("contactInfo", { required: "Required" })}
                        className={inputClass(errors.contactInfo)}
                      />
                    </Field>
                    <Field label="Stream Link" error={errors.streamLink}>
                      <input
                        type="url"
                        placeholder="https://..."
                        {...register("streamLink")}
                        className={inputClass(errors.streamLink)}
                      />
                    </Field>
                    <Field label="Discord Link" error={errors.discordLink}>
                      <input
                        type="url"
                        placeholder="https://..."
                        {...register("discordLink")}
                        className={inputClass(errors.discordLink)}
                      />
                    </Field>
                   </div>
                   <Field label="Rules & Description *" error={errors.rules}>
                    <textarea
                      rows="4"
                      placeholder="Tournament rules..."
                      {...register("rules", { required: "Rules required" })}
                      className={inputClass(errors.rules)}
                    />
                  </Field>
                </div>
              </div>

              {/* Review Summary Card */}
              <div className="bg-[#0f1923] p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Review Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Game Name</span>
                    <span className="text-white">{currentValues.gameName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Mode / Platform</span>
                    <span className="text-white">{currentValues.gameMode || '-'} / {currentValues.platform || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Date</span>
                    <span className="text-white">
                      {currentValues.tournamentDate ? new Date(currentValues.tournamentDate).toLocaleDateString() : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Prize Pool</span>
                    <span className="text-[#ff4655] font-bold">₹{currentValues.prizePool || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-700 mt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
                currentStep === 1 
                  ? "text-gray-600 cursor-not-allowed" 
                  : "text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Back
            </button>
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-[#ff4655] text-white rounded-md hover:bg-red-600 transition-colors font-medium text-sm shadow-lg shadow-red-900/20"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm shadow-lg shadow-green-900/20 flex items-center space-x-2"
              >
                <span>{isSubmitting ? "Publishing..." : "🚀 Publish Tournament"}</span>
              </button>
            )}
          </div>
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
