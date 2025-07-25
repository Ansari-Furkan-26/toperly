// ProgramCard
import React from 'react';
import { Play, Calendar, Users, Clock, Award } from 'lucide-react';
import type { Program } from '../types';


interface ProgramCardProps {
  program: Program;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden group">
        <img 
          src={program.image} 
          alt={program.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 hover:bg-white rounded-full p-4 transition-all duration-300 hover:scale-110">
            <Play className="w-6 h-6 text-toperly-purple ml-1" fill="currentColor" />
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-merriweather font-bold text-xl text-gray-900 mb-3 leading-tight">
          {program.title}
        </h3>
        
        <p className="font-inter text-gray-600 text-base leading-relaxed mb-6 flex-1">
          {program.description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <Award className="w-4 h-4" />
              <span>Format</span>
            </div>
            <span className="font-inter text-gray-900 font-medium text-sm">
              {program.format}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <Users className="w-4 h-4" />
              <span>Eligibility</span>
            </div>
            <span className="font-inter text-gray-900 font-medium text-sm">
              {program.eligibility}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>Duration</span>
            </div>
            <span className="font-inter text-gray-900 font-medium text-sm">
              {program.duration}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              <span>Deadline</span>
            </div>
            <span className="font-inter text-gray-900 font-medium text-sm">
              {program.deadline}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;