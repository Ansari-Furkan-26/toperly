import React from "react";

const MentorAccessSection = () => {
  return (
    <section className="bg-white text-black px-4 md:px-12 lg:px-24 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Text */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
            Thrive with Real-Time <br />
            <span className="italic font-medium">Access to 500+ Mentors</span>
          </h2>

          <ul className="space-y-4 text-[16px] md:text-[18px] text-gray-800">
            <li className="flex items-start gap-3">
              <span className="text-lg font-bold text-gray-700">1</span>
              <span>
                Our mentorship platform provides access to 200+ mentors for instant support
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg font-bold text-gray-700">2</span>
              <span>
                Prep for interviews, get feedback on your startup or find emotional support
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg font-bold text-gray-700">3</span>
              <span>
                Mentors are available, in most cases, within the hour for calls or meet-ups
              </span>
            </li>
          </ul>
        </div>

        {/* Right Side - Laptop + Video */}
        <div className="relative w-full max-w-2xl mx-auto">
          {/* MacBook Image */}
          <img
            src="/macbook.png"
            alt="MacBook"
            className="w-full h-auto z-10 relative"
          />

          {/* Screen content video or image */}
          <div className="absolute top-[2%] left-[11%] w-[77%] h-[93%] overflow-hidden rounded-[12px] z-10">
            <video
              src="/demo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-[12px]"
            />
            {/* If using image instead, replace <video> with:
            <img src="/screen-content.png" alt="Mentor screen" className="w-full h-full object-cover" />
            */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorAccessSection;
