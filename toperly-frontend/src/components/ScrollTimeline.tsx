import React, { useState, useEffect, useRef } from 'react';

const ScrollTimeline = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const sectionRefs = [useRef(null), useRef(null), useRef(null)];

  // Timeline data based on Toperly
  const sections = [
    {
      id: 0,
      badge: "FUTURE-READY SKILLS",
      icon: "👨‍💼",
      title: "Future-Ready Skills,",
      subtitle: "Taught Simply",
      description: "Complex AI concepts broken down into practical, easy-to-learn modules.",
      stats: [
        { text: "Interactive learning modules designed for practical understanding" },
        { text: "Step-by-step approach to complex AI concepts" },
        { text: "Real-world applications integrated into every lesson" }
      ],
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80"
    },
    {
      id: 1,
      badge: "BUILT FOR BHARAT",
      icon: "🌐",
      title: "Built for Bharat,",
      subtitle: "Backed by Experts",
      description: "Courses designed for Indian youth, powered by industry-relevant content and real-world examples.",
      stats: [
        { text: "Curriculum tailored specifically for Indian market needs" },
        { text: "Industry experts and professionals as course mentors" },
        { text: "Real-world case studies from Indian companies" }
      ],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80"
    },
    {
      id: 2,
      badge: "CAREER TRANSFORMATION",
      icon: "🎓",
      title: "From Curiosity",
      subtitle: "to Career",
      description: "Whether you're starting out or scaling up, Toperly turns interest into income.",
      stats: [
        { text: "Comprehensive career support and mentorship programs" },
        { text: "Portfolio building with real industry projects" },
        { text: "Job placement assistance and career guidance" }
      ],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80"
    }
  ];

  // Intersection Observer to detect active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = sectionRefs.findIndex(ref => ref.current === entry.target);
            if (sectionIndex !== -1) {
              setActiveSection(sectionIndex);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    sectionRefs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sectionRefs.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900" ref={containerRef} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
            Why Study AI With Toperly
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium">
            Become a valuable expert with Toperly.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Left Side - Content */}
          <div className="lg:w-1/2 space-y-16">
            {sections.map((section, index) => (
              <div
                key={section.id}
                ref={sectionRefs[index]}
                className="min-h-screen flex flex-col justify-center py-16"
              >
                {/* Badge */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center border-2 border-purple-200">
                    <span className="text-2xl">{section.icon}</span>
                  </div>
                  <span className="bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-200 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider text-purple-700">
                    {section.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-bold mb-2 leading-tight text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                  {section.title}
                </h2>
                <h3 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent" style={{ fontFamily: 'Merriweather, serif' }}>
                  {section.subtitle}
                </h3>

                {/* Description */}
                <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed font-medium">
                  {section.description}
                </p>

                {/* Stats */}
                <div className="space-y-6">
                  {section.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-1">
                        {statIndex + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-700 text-lg leading-relaxed">
                          {stat.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-12">
                  <button className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Start Learning Today
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Sticky Image */}
          <div className="lg:w-1/2">
            <div className="sticky top-8 h-screen flex items-center">
              <div className="relative w-full h-3/4 rounded-3xl overflow-hidden shadow-2xl">
                {/* Image with smooth transition */}
                <div className="relative w-full h-full">
                  {sections.map((section, index) => (
                    <img
                      key={section.id}
                      src={section.image}
                      alt={`${section.title} illustration`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                        activeSection === index ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                  
                  {/* Overlay gradient with brand colors */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-purple-500/20 to-transparent" />
                  
                  {/* Floating elements */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                      <span className="text-purple-700 font-semibold text-sm">Toperly</span>
                    </div>
                  </div>

                  {/* Play button overlay with brand styling */}
                  {/* <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-teal-400/30 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:from-purple-500/50 hover:to-teal-400/50 transition-all duration-300 hover:scale-110 border border-white/30">
                      <div className="w-0 h-0 border-l-10 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1 drop-shadow-lg"></div>
                    </div>
                  </div> */}
                </div>

                {/* Progress indicators with brand colors */}
                <div className="absolute bottom-6 left-6">
                  <div className="flex gap-3">
                    {sections.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          activeSection === index 
                            ? 'bg-gradient-to-r from-purple-500 to-teal-400 scale-125' 
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Section title overlay */}
                <div className="absolute bottom-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                    <span className="text-white font-medium text-sm">
                      {sections[activeSection]?.badge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollTimeline;