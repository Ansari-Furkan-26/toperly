import React, { useEffect, useRef, useState } from 'react';
import { X, Users, Rocket, BarChart3, Linkedin, Play } from 'lucide-react';

const CareerOutcomes = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  // Lazy fade-in animation on scroll into view
  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.18 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen px-4 py-12 sm:px-6 md:px-12 flex flex-col items-center justify-center overflow-x-hidden"
      style={{ background: "radial-gradient(ellipse at 70% 0px, #142844 0%, #001122 100%)" }}
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <svg width="100%" height="100%" className="absolute left-0 top-0 mix-blend-screen opacity-80" style={{filter: "blur(24px)"}}>
          <defs>
            <radialGradient id="rx" cx="60%" cy="0%" r="80%">
              <stop offset="0%" stopColor="#a5f3fc77"/>
              <stop offset="90%" stopColor="transparent"/>
            </radialGradient>
          </defs>
          <ellipse cx="70%" cy="16%" rx="280" ry="130" fill="url(#rx)" />
        </svg>
        <svg width="100%" height="100%" className="absolute right-0 bottom-0 mix-blend-screen" style={{filter: "blur(18px)"}}>
          <defs>
            <radialGradient id="xx" cx="100%" cy="100%" r="90%">
              <stop offset="0%" stopColor="#a78bfa33"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
          </defs>
          <ellipse cx="94%" cy="92%" rx="160" ry="90" fill="url(#xx)" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 w-full max-w-7xl mb-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              Career Outcomes & Toperly Talent
            </h1>
            <p className="text-blue-100 text-xl md:text-2xl font-medium">
              More Than Courses. We Help You Get Hired.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:block relative z-10 w-full max-w-7xl">
        <div
          className={`
            grid grid-cols-6 grid-rows-6 gap-6
            transition-all duration-1000
            ${inView ? "opacity-100" : "opacity-0 translate-y-10"}
          `}
          style={{ minHeight: "700px" }}
        >
          {/* Card 1 - AI Resume & Portfolio Builder */}
          <div className="col-span-2 row-span-3 group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/90 via-cyan-300/80 to-emerald-400/90"></div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-center items-start">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">AI Resume</h3>
              <h3 className="text-2xl md:text-3xl font-bold text-white">Portfolio Builder</h3>
            </div>
          </div>

          {/* Card 2 - Industry Projects */}
          <div className="col-span-2 row-span-3 col-start-1 row-start-4 group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" 
                alt="Industry Projects" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/60 to-transparent"></div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6 w-fit">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">Industry Projects</h3>
            </div>
          </div>

          {/* Card 3 - Access to Startup & Freelance gigs */}
          <div className="col-span-2 row-span-4 col-start-3 row-start-1 group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/90 via-slate-600/80 to-blue-600/70"></div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-8">
                <Rocket className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Access to</h3>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Startup &</h3>
              <h3 className="text-2xl md:text-3xl font-bold text-white">Freelance gigs</h3>
            </div>
          </div>

          {/* Card 4 - LinkedIn Optimization */}
          <div className="col-span-2 row-span-2 col-start-3 row-start-5 group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-blue-50"></div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-center items-start">
              <div className="bg-blue-600 rounded-2xl p-4 mb-6 flex items-center">
                <Linkedin className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">LinkedIn</h3>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Optimization</h3>
            </div>
          </div>

          {/* Card 5 - Placement Support */}
          <div className="col-span-2 row-span-3 col-start-5 row-start-1 group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=600&q=80" 
                alt="Placement Support" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/90 via-teal-300/70 to-transparent"></div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">Placement Support via</h3>
              <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Toperly Talent Hub</h3>
            </div>
          </div>

          {/* Card 6 - Join Toperly Talent */}
          <div className="row-span-3 col-start-5 row-start-4 group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/90 via-purple-400/80 to-blue-500/90"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Join</h3>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Toperly</h3>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Talent</h3>
              <div className="flex items-center space-x-3">
                <Play className="w-8 h-8 text-white" />
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-3 h-3 bg-white/70 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/50 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 7 - Profile Image */}
          <div className="row-span-3 col-start-6 row-start-4 group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80" 
                alt="Professional Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-amber-100/40 via-transparent to-yellow-50/30"></div>
          </div>
        </div>
      </div>

      {/* Mobile Grid */}
      <div className="lg:hidden relative z-10 w-full max-w-md">
        <div className="grid grid-cols-1 gap-6 space-y-2">
          {/* Mobile Card 1 - AI Resume & Portfolio Builder */}
          <div className="group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105 h-48">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/90 via-cyan-300/80 to-emerald-400/90"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">AI Resume</h3>
              <h3 className="text-xl font-bold text-white">Portfolio Builder</h3>
            </div>
          </div>

          {/* Mobile Card 2 - Access to Startup & Freelance gigs */}
          <div className="group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105 h-48">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/90 via-slate-600/80 to-blue-600/70"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mb-4">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Access to</h3>
              <h3 className="text-lg font-bold text-white mb-1">Startup &</h3>
              <h3 className="text-lg font-bold text-white">Freelance gigs</h3>
            </div>
          </div>

          {/* Mobile Card 3 - Placement Support */}
          <div className="group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105 h-48">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=600&q=80" 
                alt="Placement Support" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/90 via-teal-300/70 to-transparent"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-center">
              <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg">Placement Support via</h3>
              <h3 className="text-lg font-bold text-white drop-shadow-lg">Toperly Talent Hub</h3>
            </div>
          </div>

          {/* Mobile Card 4 - Industry Projects */}
          <div className="group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105 h-48">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" 
                alt="Industry Projects" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/60 to-transparent"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mb-4 w-fit">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Industry Projects</h3>
            </div>
          </div>

          {/* Mobile Card 5 - LinkedIn Optimization */}
          <div className="group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105 h-48">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-blue-50"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center">
              <div className="bg-blue-600 rounded-2xl p-3 mb-4 flex items-center">
                <Linkedin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">LinkedIn</h3>
              <h3 className="text-lg font-bold text-gray-900">Optimization</h3>
            </div>
          </div>

          {/* Mobile Card 6 - Join Toperly Talent */}
          <div className="group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105 h-48">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/90 via-purple-400/80 to-blue-500/90"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-bold text-white mb-1">Join</h3>
              <h3 className="text-lg font-bold text-white mb-1">Toperly</h3>
              <h3 className="text-lg font-bold text-white mb-4">Talent</h3>
              <div className="flex items-center space-x-2">
                <Play className="w-6 h-6 text-white" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Card 7 - Profile Image */}
          <div className="group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-500 hover:scale-105 h-48">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80" 
                alt="Professional Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-amber-100/40 via-transparent to-yellow-50/30"></div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(32px) scale(0.96); }
          70% { opacity: 1; }
          100% { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
};

export default CareerOutcomes;