import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EditTournamentModal({ isOpen, onClose, tournament, onSave }) {
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
  const registrationDate = watch("registrationDate");
  const registrationTime = watch("registrationTime");

  // Check if original registration deadline has passed relative to CURRENT time (for disabling)
  const isRegistrationClosed = React.useMemo(() => {
    if (!tournament?.registrationDate || !tournament?.registrationTime) return false;
    const d = new Date(tournament.registrationDate);
    const t = new Date(tournament.registrationTime);
    const deadline = new Date(d);
    deadline.setHours(t.getHours());
    deadline.setMinutes(t.getMinutes());
    return deadline < new Date();
  }, [tournament]);

  useEffect(() => {
    if (tournament && isOpen) {
      // Pre-fill form with tournament data
      reset({
        gameName: tournament.gameName || tournament.game || '',
        gameMode: (tournament.gameMode || tournament.mode || '').toLowerCase(),
        platform: (tournament.platform || '').toLowerCase(),
        status: tournament.status || 'Active',
        slots: tournament.slots || tournament.maxSlots || '',
        prizePool: tournament.prizePool ? String(tournament.prizePool).replace(/[^0-9]/g, '') : '',
        entryFee: tournament.entryFee || 0,
        teamSize: tournament.teamSize || 1,
        // Dates need to be parsed to Date objects for DatePicker
        tournamentDate: tournament.tournamentDate ? new Date(tournament.tournamentDate) : null,
        tournamentTime: tournament.tournamentTime ? new Date(tournament.tournamentTime) : null,
        registrationDate: tournament.registrationDate ? new Date(tournament.registrationDate) : null,
        registrationTime: tournament.registrationTime ? new Date(tournament.registrationTime) : null,
        contactInfo: tournament.contactInfo || '',
        streamLink: tournament.streamLink || '',
        discordLink: tournament.discordLink || '',
        rules: tournament.rules || '',
        firstPrize: tournament.firstPrize || '',
        secondPrize: tournament.secondPrize || '',
        thirdPrize: tournament.thirdPrize || '',
      });
    }
  }, [tournament, isOpen, reset]);

  const onSubmit = async (data) => {
    console.log("Updating tournament:", data);
    if (onSave) {
      await onSave(data);
    }
    alert(`Tournament "${tournament.name}" updated successfully!`);
    onClose();
  };

  const inputClass = (error) =>
    `w-full bg-[#0f1923] border ${error ? "border-red-500" : "border-gray-700"} text-white px-3 py-2 rounded-md focus:border-[#ff4655] focus:outline-none focus:ring-2 focus:ring-[#ff4655]/50 text-sm [color-scheme:dark]`;

  const Field = ({ label, error, children }) => (
    <div>
      <label className="block text-xs sm:text-sm mb-1 text-gray-300">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );

  if (!tournament) return null;

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
            <div className="sticky top-0 bg-[#1E2837] border-b border-gray-700 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-white">Edit Tournament</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Game Name */}
                <Field label="Game Name" error={errors.gameName}>
                  <input
                    type="text"
                    placeholder="e.g., Valorant, PUBG"
                    {...register("gameName", { required: "Game name is required" })}
                    className={inputClass(errors.gameName)}
                  />
                </Field>

                {/* Game Mode */}
                <Field label="Game Mode" error={errors.gameMode}>
                  <select {...register("gameMode", { required: "Game mode is required" })} className={inputClass(errors.gameMode)}>
                    <option value="">Select Mode</option>
                    <option value="solo">Solo</option>
                    <option value="duo">Duo</option>
                    <option value="squad">Squad</option>
                    <option value="team">Team</option>
                  </select>
                </Field>

                {/* Platform */}
                <Field label="Platform" error={errors.platform}>
                  <select {...register("platform", { required: "Platform is required" })} className={inputClass(errors.platform)}>
                    <option value="">Select Platform</option>
                    <option value="pc">PC</option>
                    <option value="mobile">Mobile</option>
                    <option value="console">Console</option>
                    <option value="cross-platform">Cross-Platform</option>
                  </select>
                </Field>

                {/* Status */}
                <Field label="Status" error={errors.status}>
                  <select {...register("status", { required: "Status is required" })} className={inputClass(errors.status)}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </Field>

                {/* Tournament Date */}
                <Field label="Tournament Date" error={errors.tournamentDate}>
                  <Controller
                    name="tournamentDate"
                    control={control}
                    rules={{ required: "Tournament date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        placeholderText="Select date"
                        className={inputClass(errors.tournamentDate)}
                      />
                    )}
                  />
                </Field>

                {/* Tournament Time */}
                <Field label="Tournament Time" error={errors.tournamentTime}>
                  <Controller
                    name="tournamentTime"
                    control={control}
                    rules={{ required: "Tournament time is required" }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeFormat="h:mm aa"
                        dateFormat="h:mm aa"
                        placeholderText="Select time"
                        className={inputClass(errors.tournamentTime)}
                      />
                    )}
                  />
                </Field>

                {/* Registration Deadline Date */}
                <Field label="Registration Deadline" error={errors.registrationDate}>
                  <Controller
                    name="registrationDate"
                    control={control}
                    rules={{
                      required: "Registration deadline is required",
                    }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        maxDate={tournamentDate} // Still useful for UX
                        placeholderText="Select deadline"
                        className={`${inputClass(errors.registrationDate)} ${isRegistrationClosed ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isRegistrationClosed}
                      />
                    )}
                  />
                </Field>

                {/* Registration Time */}
                <Field label="Registration Time" error={errors.registrationTime}>
                  <Controller
                    name="registrationTime"
                    control={control}
                    rules={{ required: "Registration time is required" }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeFormat="h:mm aa"
                        dateFormat="h:mm aa"
                        placeholderText="Select time"
                        className={`${inputClass(errors.registrationTime)} ${isRegistrationClosed ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isRegistrationClosed}
                      />
                    )}
                  />
                </Field>

                {/* Slots */}
                <Field label="Total Slots" error={errors.slots}>
                  <input
                    type="number"
                    placeholder="e.g., 100"
                    {...register("slots", {
                      required: "Slots are required",
                      min: { value: 2, message: "Minimum 2 slots" },
                      max: { value: 1000, message: "Maximum 1000 slots" },
                    })}
                    className={inputClass(errors.slots)}
                  />
                </Field>

                {/* Team Size */}
                <Field label="Team Size" error={errors.teamSize}>
                  <input
                    type="number"
                    placeholder="e.g., 4"
                    {...register("teamSize", {
                      required: "Team size is required",
                      min: { value: 1, message: "Minimum 1 player" },
                    })}
                    className={inputClass(errors.teamSize)}
                  />
                </Field>

                {/* Entry Fee */}
                <Field label="Entry Fee (₹)" error={errors.entryFee}>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    {...register("entryFee", { min: { value: 0, message: "Cannot be negative" } })}
                    className={inputClass(errors.entryFee)}
                  />
                </Field>

                {/* Prize Pool */}
                <Field label="Prize Pool (₹)" error={errors.prizePool}>
                  <input
                    type="number"
                    placeholder="e.g., 10000"
                    {...register("prizePool", { required: "Prize pool is required" })}
                    className={inputClass(errors.prizePool)}
                  />
                </Field>

                {/* First Prize */}
                <Field label="1st Prize (₹)" error={errors.firstPrize}>
                  <input
                    type="number"
                    placeholder="e.g., 5000"
                    {...register("firstPrize")}
                    className={inputClass(errors.firstPrize)}
                  />
                </Field>

                {/* Second Prize */}
                <Field label="2nd Prize (₹)" error={errors.secondPrize}>
                  <input
                    type="number"
                    placeholder="e.g., 3000"
                    {...register("secondPrize")}
                    className={inputClass(errors.secondPrize)}
                  />
                </Field>

                {/* Third Prize */}
                <Field label="3rd Prize (₹)" error={errors.thirdPrize}>
                  <input
                    type="number"
                    placeholder="e.g., 2000"
                    {...register("thirdPrize")}
                    className={inputClass(errors.thirdPrize)}
                  />
                </Field>
              </div>

              {/* Contact Info */}
              <div className="mt-4">
                <Field label="Contact Info" error={errors.contactInfo}>
                  <input
                    type="text"
                    placeholder="Phone/Email/Discord"
                    {...register("contactInfo", { required: "Contact info is required" })}
                    className={inputClass(errors.contactInfo)}
                  />
                </Field>
              </div>

              {/* Stream Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Field label="Stream Link" error={errors.streamLink}>
                  <input
                    type="url"
                    placeholder="YouTube/Twitch URL"
                    {...register("streamLink", {
                      pattern: { value: /^https?:\/\/.+/, message: "Invalid URL" },
                    })}
                    className={inputClass(errors.streamLink)}
                  />
                </Field>

                <Field label="Discord Link" error={errors.discordLink}>
                  <input
                    type="url"
                    placeholder="Discord server invite"
                    {...register("discordLink", {
                      pattern: { value: /^https?:\/\/.+/, message: "Invalid URL" },
                    })}
                    className={inputClass(errors.discordLink)}
                  />
                </Field>
              </div>

              {/* Rules */}
              <div className="mt-4">
                <Field label="Rules & Regulations" error={errors.rules}>
                  <textarea
                    rows="4"
                    placeholder="Enter tournament rules..."
                    {...register("rules", { required: "Rules are required" })}
                    className={inputClass(errors.rules)}
                  />
                </Field>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-[#0f1923] hover:bg-[#1a2332] text-gray-300 py-2.5 rounded-md font-semibold transition-all border border-gray-700"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`flex-1 ${isSubmitting ? "bg-gray-600 cursor-not-allowed" : "bg-[#ff4655] hover:bg-red-600"} text-white py-2.5 rounded-md font-semibold transition-all`}
                >
                  {isSubmitting ? "Updating..." : "Update Tournament"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
