import React from "react";
import { Play } from "lucide-react";

const ThoughtLeadership = () => {
  const videos = [
    {
      title: "Exploring the Future of AI",
      subtitle: "Dr. Nandini Seth – Professor, Masters’ Union, on ",
      highlight: "TRS with Ranveer Allahbadia",
      image: "https://images.mastersunion.link/uploads/30062025/v2/Frame1171280178.webp",
    },
    {
      title: "How to Build a Profitable Company in India",
      subtitle:
        "Rajiv Gupta – Chair, School of Family Business, on ",
      highlight: "Figuring It Out with Raj Shamani",
      image: "https://images.mastersunion.link/uploads/30062025/v1/Frame1321317741.webp",
    }
  ];

  return (
    <section
      className="py-16 px-4 sm:px-8"
      style={{
        background: "linear-gradient(to right, #66D3DC, #F7C75C)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto bg-white rounded-2xl p-10 shadow-lg">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Thought Leadership from{" "}
            <span className="italic font-merriweather">Our Faculty</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            At Masters’ Union, our faculty are not just teachers — <br className="hidden sm:block" />
            they are industry leaders driving real-world change
          </p>
        </div>

        {/* Videos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {videos.map((video, index) => (
            <div key={index}>
              <div className="relative rounded-xl overflow-hidden shadow-md group">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-[280px] object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-white/60 backdrop-blur-md p-2 rounded-full group-hover:scale-110 transition-transform">
                  <Play className="text-gray-800 w-5 h-5" />
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-4 text-gray-900">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {video.subtitle}
                <span className="font-semibold text-gray-800">
                  {video.highlight}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThoughtLeadership;
