"use client";
import { useEffect, useRef, useState } from "react";
import { ImPower } from "react-icons/im";

export default function AILearningHero() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="relative min-h-screen tracking-tight overflow-hidden" >

      {/* Main content container */}
      <div className="relative z-10 flex items-start mt-10 min-h-screen px-6 lg:px-12">
        <div className="max-w-8xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side content with lazy fade-in */}
          <div className={`space-y-8 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full border border-white border-opacity-20">
              <div className="w-7 h-7 flex justify-center items-center ml-2 text-orange-400 bg-orange-100 rounded-full overflow-hidden hover:text-white hover:bg-orange-400">
                <ImPower />
              </div>
              <span className="text-white text-sm font-medium pr-4 py-2">India's First AI Learning Platform</span>
            </div>

            {/* Main heading with gradient flow */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                <span className="gradient-flow">
                  Making India Ready For<br />
                  The Future With AI
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-xl lg:text-2xl text-gray-200 font-medium">
              Learn AI From The Group Up –
            </p>

            {/* Additional text */}
            <p className="text-lg text-gray-300">
              No Experience Needed
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2 shadow-lg">
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              
              <button className="bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2 border border-white border-opacity-30 shadow-lg">
                Explore courses
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for gradient flow */}
      <style>{`
        .gradient-flow {
          background: linear-gradient(90deg, #ffffff, #a1c4fd, #c2e9fb, #ffffff);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 5s linear infinite;
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
