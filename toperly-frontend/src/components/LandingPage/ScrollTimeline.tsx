import React, { useState, useEffect, useRef } from 'react';

const ScrollTimeline = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const sectionRefs = [useRef(null), useRef(null)];

  // Timeline data
  const sections = [
    {
      id: 0,
      badge: "CONSULTING CHALLENGE",
      icon: "",
      title: "Solve Real Problems &",
      subtitle: "Learn from Leadership",
      description: "Consult Cars24 & 100+ companies, solve real problems, pitch to leadership & have a shot at placements",
      stats: [
        { number: "15%", text: "of student consultants land PPOs" },
        { number: "300+", text: "clients annually" },
        { number: "1 in 6", text: "live projects with international firms" }
      ],
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80"
    },
    {
      id: 1,
      badge: "MASTERS' UNION INVESTMENT FUND",
      icon: "",
      title: "Invest From a",
      subtitle: "5Cr Student Fund",
      description: "Learn investment strategies and manage real capital with guidance from industry experts and successful fund managers",
      stats: [
        { number: "₹5Cr", text: "total fund size managed by students" },
        { number: "20+", text: "portfolio companies analyzed" },
        { number: "85%", text: "average annual returns achieved" }
      ],
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=600&q=80"
    }
  ];

  // Intersection Observer to detect active section (only for desktop)
  useEffect(() => {
    const checkIfDesktop = () => window.innerWidth >= 1024;
    
    if (!checkIfDesktop()) return;

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

  const renderMobileLayout = () => (
    <div className="lg:hidden space-y-0">
      {sections.map((section, index) => (
        <div 
          key={section.id} 
          className={`pb-12 ${
            index < sections.length - 1 ? 'border-b border-gray-700 mb-12' : ''
          }`}
        >
          {/* Image First */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8">
            <img
              src={section.image}
              alt={`${section.title} illustration`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Content After Image */}
          <div>
            {/* Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-gray-800 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider">
                {section.badge}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold leading-tight">
              {section.title}
            </h2>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              {section.subtitle}
            </h3>

            {/* Description */}
            <p className="text-base text-gray-300 mb-8 leading-relaxed">
              {section.description}
            </p>

            {/* Stats */}
            <div className="space-y-2">
              {section.stats.map((stat, statIndex) => (
                <div key={statIndex} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border border-gray-500 flex items-center justify-center text-xs font-bold">
                    {statIndex + 1}
                  </div>
                  <div>
                    <span className="text-sm font-bold mr-1">
                      {stat.number}
                    </span>
                    <span className="text-gray-300 text-sm">
                      {stat.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDesktopLayout = () => (
    <div className="hidden lg:flex gap-16">
      {/* Left Side - Content with Timeline */}
      <div className="w-1/2 relative">
        {/* Vertical connecting line */}
        <div className="absolute left-5 top-32 bottom-32 w-0.5 bg-gradient-to-b from-blue-400 via-gray-600 to-green-400"></div>
        
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div
              key={section.id}
              ref={sectionRefs[index]}
              className="min-h-screen flex flex-col justify-evenly relative"
            >
              {/* Timeline dot */}
              <div className={`absolute left-3.5 w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === index ? 'bg-blue-400 shadow-lg shadow-blue-400/50' : 'bg-gray-600'
              }`}></div>

              {/* Content with left margin for timeline */}
              <div className="ml-16">
                {/* Badge */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-gray-800 px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
                    {section.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  {section.title}
                </h2>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  {section.subtitle}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-lg text-gray-300 mb-8 leading-relaxed">
                  {section.description}
                </p>

                {/* Stats */}
                <div className="space-y-4">
                  {section.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-black border border-gray-500 flex items-center justify-center text-sm font-bold">
                        {statIndex + 1}
                      </div>
                      <div>
                        <span className="text-sm font-bold mr-2">
                          {stat.number}
                        </span>
                        <span className="text-gray-300">
                          {stat.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Sticky Image */}
      <div className="w-1/2">
        <div className="sticky top-8 h-screen flex items-center">
          <div className="relative w-full h-3/4 rounded-2xl overflow-hidden">
            {/* Image with smooth transition */}
            <div className="relative w-[80%] h-[80%] mt-20">
              {sections.map((section, index) => (
                <img
                  key={section.id}
                  src={section.image}
                  alt={`${section.title} illustration`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    activeSection === index ? 'opacity-100 animate-blink' : 'opacity-0'
                  }`}
                />
              ))}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center md:mt-16">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
            Hands-On Learning:
          </h1>
          <p className="text-xl md:text-2xl lg:text-4xl font-light italic text-blue-400">
            Consult, Invest, Experience
          </p>
        </div>

        {/* Render different layouts based on screen size */}
        {renderMobileLayout()}
        {renderDesktopLayout()}
      </div>
    </div>
  );
};

export default ScrollTimeline;
