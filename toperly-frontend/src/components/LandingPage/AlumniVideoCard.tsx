import React from "react";
import { Play } from "lucide-react";

const AlumniVideoCard = ({ alumni }) => {
  return (
    <div className="relative w-full rounded-xl overflow-hidden h-96 md:h-[500px]">
      {/* Background Image */}
      <img
        src={alumni.image}
        alt={`${alumni.name} video thumbnail`}
        className="w-full h-full object-cover"
      />

      {/* Watch Video Button */}
      <button className="absolute top-4 left-4 z-10 flex items-center gap-2 text-white font-medium hover:scale-105 transition-transform duration-200">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200">
          <Play className="w-4 h-4 fill-white" />
        </div>
        <span className="text-sm md:text-base hidden sm:block">Watch Video</span>
      </button>

      {/* Bottom Left Badge */}
      <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg text-xs md:text-sm font-semibold text-gray-900">
        <span>{alumni.position} @ </span>
        <span className="text-[#1961c5]">{alumni.company}</span>
      </div>

      {/* Top Right Name Tag */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-xs md:text-sm text-gray-800 font-medium shadow-lg">
        <div className="font-semibold">{alumni.name}</div>
        <div className="text-gray-500 text-xs font-normal">{alumni.program}</div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default AlumniVideoCard;
