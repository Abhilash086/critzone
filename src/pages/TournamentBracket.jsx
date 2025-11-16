import React from "react";
import Navbar from "../components/Navbar";

const TournamentBracket = () => {
  return (
    <div className="h-full w-full overflow-x-hidden bg-gradient-to-b from-[#1B2430] via-[#212A37] to-[#0D1117] text-white font-orbitron">
      <Navbar />
      <div className="h-full pt-28">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-red-500 text-4xl">
            Tournament Bracket
          </h1>
          <div>
            <div className="h-6 px-2 py-4 w-full bg-amber-700 -skew-x-[20deg]">
              Phoenix fire
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
