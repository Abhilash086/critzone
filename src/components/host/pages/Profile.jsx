// pages/Profile.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useUser } from "../../../context/UserContext";

export default function Profile() {
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, you would make an API call here to update the user
    // await api.updateProfile(formData);
    
    // For now, update local context and exit edit mode
    setUser(prev => ({
      ...prev,
      email: formData.email,
      phone: formData.phone,
      // If backend supports avatar URL update, include it here
    }));
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData({
      email: user?.email || "",
      phone: user?.phone || "",
      avatar: user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`
    });
    setIsEditing(false);
  };

  console.log("Current User:", user);

  if (!user) {
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-400">
        Authentication required.
      </div>
    );
  }

  const host = {
    name: user.username,
    email: user.email,
    phone: user.phone || "Not provided",
    inviteCode: user.inviteCode || "N/A",
    verified: user.Verified ? "Verified" : "Unverified",
    joined: new Date(user.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    role: user.role === "host" ? "Tournament Host" : "Player",
    avatar: formData.avatar,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider font-[Orbitron]"
        >
          {isEditing ? "Edit Profile" : "My Profile"}
        </motion.h1>

        {isEditing && (
          <div className="flex gap-2">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative"
      >
        {/* Profile Header Background */}
        <div className="h-32 bg-gradient-to-r from-[#ff4655]/20 to-[#0f1923]"></div>
        
        <div className="px-6 pb-8 relative">
          
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6 gap-6">
             <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative group"
            >
               <div className="absolute inset-0 bg-[#ff4655] rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity"></div>
               <img
                src={host.avatar}
                alt="avatar"
                className="relative w-32 h-32 rounded-full border-4 border-[#0f1923] bg-[#1E2837] shadow-xl z-10 object-cover"
              />
              
              {isEditing && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                   <span className="text-white text-xs font-bold uppercase text-center px-2">Change Image</span>
                   <input 
                      type="text" 
                      placeholder="Enter Image URL"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                          const url = prompt("Enter new image URL:", host.avatar);
                          if(url) setFormData({...formData, avatar: url});
                      }}
                   />
                </div>
              )}

              <div title={host.verified} className={`absolute bottom-2 right-2 z-20 w-6 h-6 rounded-full border-2 border-[#0f1923] flex items-center justify-center ${host.verified === "Verified" ? "bg-green-500" : "bg-yellow-500"}`}>
                 {host.verified === "Verified" && <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
            </motion.div>
            
            <div className="text-center sm:text-left pb-2 flex-1">
               <h2 className="text-3xl font-bold text-white font-[Rajdhani]">{host.name}</h2>
               <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1">
                 <span className="px-3 py-1 bg-[#ff4655]/10 border border-[#ff4655]/20 text-[#ff4655] text-xs font-bold uppercase rounded tracking-wide">
                   {host.role}
                 </span>
                 <span className="text-gray-400 text-sm flex items-center gap-1">
                   Since {host.joined}
                 </span>
               </div>
            </div>
          </div>


          {/* Details Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t border-gray-800"
          >
            {/* Contact Info Group */}
            <div className="space-y-4">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Contact Information</h3>
              
              <div className={`group bg-[#0f1923] p-3 rounded-lg border transition-colors ${isEditing ? "border-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.1)]" : "border-gray-800 hover:bg-[#1a232d]"}`}>
                 <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Email Address</label>
                 {isEditing ? (
                   <input
                     type="email"
                     name="email"
                     value={formData.email}
                     onChange={handleInputChange}
                     className="w-full bg-transparent text-white font-mono text-sm focus:outline-none placeholder-gray-600"
                     placeholder="Enter email"
                   />
                 ) : (
                   <div className="text-gray-200 font-mono text-sm">{host.email}</div>
                 )}
              </div>

               <div className={`group bg-[#0f1923] p-3 rounded-lg border transition-colors ${isEditing ? "border-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.1)]" : "border-gray-800 hover:bg-[#1a232d]"}`}>
                 <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Phone Number</label>
                 {isEditing ? (
                   <input
                     type="tel"
                     name="phone"
                     value={formData.phone}
                     onChange={handleInputChange}
                     className="w-full bg-transparent text-white font-mono text-sm focus:outline-none placeholder-gray-600"
                     placeholder="Enter phone number"
                   />
                 ) : (
                   <div className="text-gray-200 font-mono text-sm">{host.phone}</div>
                 )}
              </div>
            </div>


            {/* Account Info Group */}
            <div className="space-y-4">
               <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Account Details</h3>

              <div className="group bg-[#0f1923] hover:bg-[#1a232d] p-3 rounded-lg border border-gray-800 transition-colors">
                  <label className="text-[10px] text-gray-500 uppercase font-bold block mb-2">Verification Status</label>
                  <div className="flex items-center gap-3">
                     {host.verified === "Verified" ? (
                        <div className="flex items-center gap-2 text-green-500">
                           <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                           </div>
                           <span className="font-bold text-sm tracking-wide">Verified Account</span>
                        </div>
                     ) : (
                        <div className="flex items-center gap-2 text-yellow-500">
                           <div className="h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                           </div>
                           <span className="font-bold text-sm tracking-wide">Unverified</span>
                        </div>
                     )}
                  </div>
              </div>
            </div>
          </motion.div>

          {/* Action Footer */}
          {!isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
               <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(true)}
                className="bg-[#2a2f3a] hover:bg-white hover:text-black text-white px-6 py-2.5 rounded-lg transition-all shadow-lg text-sm font-bold uppercase tracking-wider border border-gray-600 hover:border-white"
              >
                Edit Profile
              </motion.button>
            </div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
}
