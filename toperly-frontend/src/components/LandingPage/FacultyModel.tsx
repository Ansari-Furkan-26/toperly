import React from 'react';

const FacultyModel = () => {
  const facultyMembers = [
    {
      name: "Mr. Rajat Mathur",
      title: "Managing Director",
      company: "Morgan Stanley",
      image: "https://images.mastersunion.link/uploads/24062025/v2/garimaChaklader.webp"
    },
    {
      name: "Mr. Naveen Munjal",
      title: "Managing Director", 
      company: "HERO ELECTRIC",
      image: "https://images.mastersunion.link/uploads/24062025/v1/vipin.webp"
    },
    {
      name: "Mr. Arjun Vaidya",
      title: "Founder",
      company: "DR. VAIDYA'S",
      image: "https://images.mastersunion.link/uploads/24062025/v2/garimaChaklader.webp"
    },
    {
      name: "Mr. Manoj Kohli",
      title: "Former Country Head",
      company: "SoftBank",
      image: "https://images.mastersunion.link/uploads/24062025/v1/vipin.webp"
    },
    {
      name: "Captain Raghu Raman",
      title: "Former President",
      company: "Reliance",
      image: "https://images.mastersunion.link/uploads/24062025/v2/garimaChaklader.webp"
    },
    {
      name: "Mr Rohit Kapoor",
      title: "CEO, Food Marketplace",
      company: "Swiggy",
      image: "https://images.mastersunion.link/uploads/24062025/v1/vipin.webp"
    }
  ];

  return (
    <div className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-12">
          <div className="mb-8 lg:mb-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
              Faculty Model at <span className="italic">Masters' Union</span>
            </h2>
          </div>
          <div className="lg:mt-4">
            <button className="border border-gray-400 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium">
              See all our Masters ↗
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Side - Statistics */}
          <div className="lg:col-span-4 space-y-8 lg:space-y-12">
            <div className="flex items-start">
              <div className="w-1 bg-yellow-400 h-24 mr-6"></div>
              <div>
                <div className="text-6xl sm:text-7xl lg:text-8xl font-light text-yellow-400 leading-none">
                  40<span className="text-4xl sm:text-5xl lg:text-6xl">%</span>
                </div>
                <div className="mt-2">
                  <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Industry Practitioners</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    Leaders and entrepreneurs sharing real-world insights
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-1 bg-gray-600 h-24 mr-6"></div>
              <div>
                <div className="text-6xl sm:text-7xl lg:text-8xl font-light text-gray-400 leading-none">
                  30<span className="text-4xl sm:text-5xl lg:text-6xl">%</span>
                </div>
                <div className="mt-2">
                  <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Full-Time Faculty</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    Dedicated educators shaping core learning
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-1 bg-gray-600 h-24 mr-6"></div>
              <div>
                <div className="text-6xl sm:text-7xl lg:text-8xl font-light text-gray-400 leading-none">
                  30<span className="text-4xl sm:text-5xl lg:text-6xl">%</span>
                </div>
                <div className="mt-2">
                  <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Visiting Faculty</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    Professors from Harvard, Stanford and Wharton
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Faculty Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {facultyMembers.map((member, index) => (
                <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                  {/* Image Section with Yellow Brush Effect */}
                  <div className="relative">
                    <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 h-40 sm:h-48 relative overflow-hidden">
                      {/* Yellow brush strokes background */}
                      <div className="absolute inset-0 opacity-30">
                        
                      </div>
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full sm:w-full sm:h-full object-cover object-top"
                      />
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-4 sm:p-5">
                    <h3 className="text-lg sm:text-xl font-medium text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {member.title}
                    </p>
                    <div className="text-gray-500 text-xs font-medium">
                      {member.company}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyModel;