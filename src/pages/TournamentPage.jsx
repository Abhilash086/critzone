import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import TournamentCard from "../components/TournamentCard";
import Footer from "../components/Footer";
import { formatTimeLeft } from "../utils/dateUtils";
import { api } from "../services/api";
import Loader from "../components/Loader";

// Helper to determine image based on game name
const getImageForGame = (gameName) => {
  if (!gameName) return "https://wallpapercave.com/wp/wp8213594.jpg"; // Default
  
  const lowerName = gameName.toLowerCase();
  if (lowerName.includes("valorant")) return "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt3f072456384375b9/6216ec711467431f40d6c5bb/VALORANT_Jett_Wallpaper_1920x1080.jpg";
  if (lowerName.includes("bgmi") || lowerName.includes("pubg")) return "https://wallpaperaccess.com/full/6231016.jpg";
  if (lowerName.includes("free fire")) return "https://wallpapers.com/images/featured/free-fire-4k-dc5ck93u6k5s9675.jpg";
  if (lowerName.includes("cod") || lowerName.includes("call of duty")) return "https://wallpaperaccess.com/full/2223403.jpg";
  
  return "https://wallpapercave.com/wp/wp8213594.jpg";
};

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        console.log("Fetching tournaments...");
        const response = await api.getTournaments();
        console.log("API Response:", response);

        const tournamentsList = response.tournaments || [];
        
        const data = tournamentsList.map(t => {
          // Robust date handling
          let tournamentDate = new Date(t.tournamentDate);
          
          // If we have a separate time string, merge it
          if (t.tournamentTime) {
            const timeDate = new Date(t.tournamentTime);
            // Check if timeDate is valid
            if (!isNaN(timeDate.getTime())) {
                tournamentDate.setHours(timeDate.getHours());
                tournamentDate.setMinutes(timeDate.getMinutes());
                tournamentDate.setSeconds(timeDate.getSeconds()); 
            }
          }
          
          return {
            id: t._id,
            ...t,
            // Ensure we have a valid ISO string for date comparisons
            date: tournamentDate.toISOString(), 
            image: getImageForGame(t.gameName),
            timeLeft: formatTimeLeft(tournamentDate)
          };
        });
        
        console.log("Processed Data:", data);
        setTournaments(data);
      } catch (error) {
        console.error("Failed to fetch tournaments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    if (tournaments.length === 0) return;

    const interval = setInterval(() => {
      setTournaments((prev) =>
        prev.map((t) => ({
          ...t,
          timeLeft: formatTimeLeft(t.date),
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [tournaments.length]); // depend on length to start interval once data is loaded

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B2430] via-[#212A37] to-[#0D1117] text-white font-orbitron">
      <Navbar />

      <div className="px-6 py-20 pt-28 max-w-7xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1
            animate={{ 
              textShadow: [
                "0 0 20px rgba(255,70,85,0.6)",
                "0 0 40px rgba(255,70,85,0.8)",
                "0 0 20px rgba(255,70,85,0.6)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl sm:text-6xl font-extrabold text-[#ff4655] mb-4"
          >
            Upcoming Tournaments
          </motion.h1>
          <p className="text-gray-400 text-lg">
            Join the battlefield and compete for glory
          </p>
        </motion.div>

        {/* Tournament Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {tournaments.length > 0 ? (
              tournaments.map((tournament, index) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  index={index}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 text-xl">
                No upcoming tournaments found.
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
