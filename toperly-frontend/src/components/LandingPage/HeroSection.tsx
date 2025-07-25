"use client";
import { useEffect, useRef, useState } from "react";
import { ImPower } from "react-icons/im";

export default function HeroSection() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={sectionRef} 
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: `url('/bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Main content container */}
      <div className="relative z-10 flex items-center min-h-screen px-6 lg:px-12 lg:pt-12">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Left side content with lazy fade-in */}
          <div className={`max-w-3xl space-y-8 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            
            {/* Badge */}
            <div className="hidden sm:inline-flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full border border-white border-opacity-20">
              <div className="w-7 h-7 flex justify-center items-center ml-2 text-orange-400 bg-orange-100 rounded-full overflow-hidden hover:text-white hover:bg-orange-400 transition-colors duration-200">
                <ImPower />
              </div>
              <span className="text-white text-sm font-medium pr-4 py-2">India's First AI Learning Platform</span>
            </div>

            {/* Main heading inspired by the image */}
            <div className="space-y-4">
                <div>
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                Learn
              </h1>
              <div className="flex items-center gap-4">
                <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight lg:pb-4">
                  by
                </h1>
                <span className="gradient-flow text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight italic lg:pb-4">
                  Doing
                </span>
              </div>
              </div>
              <p className="text-xl lg:text-2xl text-gray-200 font-medium mt-8">
                Making India Ready For The Future With AI
              </p>
            </div>

            {/* Subtext */}
            <p className="text-lg text-gray-300">
              Learn AI From The Ground Up – No Experience Needed
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-white hover:bg-gray-100 text-black px-4 py-2 md:px-8 md:py-4 rounded-full font-semibold text-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Watch Intro Video
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              
              <button className="bg-transparent hover:bg-white hover:bg-opacity-10 text-white px-4 py-2 md:px-8 md:py-4 rounded-full font-semibold text-lg transition-all duration-200 flex items-center gap-2 border border-white border-opacity-50 hover:border-opacity-100 shadow-lg">
                Download Yearbook
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>

          
        </div>
      </div>

      {/* Custom CSS for gradient flow */}
      <style>{`
        .gradient-flow {
          background: linear-gradient(90deg, #00d4ff, #ffeb3b, #ff6b6b, #4ecdc4, #45b7d1);
          background-size: 300% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 8s ease-in-out infinite;
        }

        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @media (max-width: 768px) {
          .gradient-flow {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}