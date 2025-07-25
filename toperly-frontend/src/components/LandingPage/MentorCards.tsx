import React, { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Mentor {
  name: string;
  role: string;
  company: string;
  logo?: string;
  image: string;
  sessions: number;
}

const categories = ["Consulting", "Product Management", "Marketing", "Finance"];

const mentors: Mentor[] = [
  {
    name: "Mohit Geat",
    role: "Consultant",
    company: "McKinsey & Company",
    image: "https://images.mastersunion.link/uploads/23062025/v1/mohitGeat.webp",
    sessions: 1220,
  },
  {
    name: "Geetika Bajaj",
    role: "Head- Corporate Channel",
    company: "MakeMyTrip",
    image: "https://images.mastersunion.link/uploads/23062025/v1/mohitGeat.webp",
    sessions: 423,
  },
  {
    name: "Megha Punjabi",
    role: "Consultant",
    company: "American Express",
    image: "https://images.mastersunion.link/uploads/23062025/v1/mohitGeat.webp",
    sessions: 239,
  },
  {
    name: "Akshit Aggarwal",
    role: "Senior Associate",
    company: "American Express",
    image: "https://images.mastersunion.link/uploads/23062025/v1/mohitGeat.webp",
    sessions: 184,
  },
  {
    name: "Prabhav Narang",
    role: "Associate",
    company: "EY Parthenon",
    image: "https://images.mastersunion.link/uploads/23062025/v1/mohitGeat.webp",
    sessions: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "Google",
    image: "https://images.mastersunion.link/uploads/23062025/v1/mohitGeat.webp",
    sessions: 892,
  },
  {
    name: "David Chen",
    role: "Marketing Director",
    company: "Meta",
    image: "https://images.mastersunion.link/uploads/23062025/v1/mohitGeat.webp",
    sessions: 567,
  },
];

const MentorCards = () => {
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handleSlideChange = (swiper: any) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="bg-black text-white px-4 md:px-16 py-10 space-y-8">
      {/* Categories */}
      <div className="flex flex-wrap gap-4">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`px-5 py-2 rounded-full text-sm font-medium border ${
              idx === 0
                ? "bg-white text-black"
                : "bg-transparent text-white border-white/40 hover:border-white/60 transition-colors"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards + Arrows */}
      <div className="relative">
        {/* Navigation Arrows - Hidden on mobile */}
        <div className="hidden md:flex items-center justify-end gap-3 mb-4 absolute top-[-80px] right-0 z-10">
          <button 
            onClick={handlePrev}
            disabled={isBeginning}
            className={`w-10 h-10 rounded-full border border-white/30 flex items-center justify-center transition ${
              isBeginning 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-white/10 cursor-pointer'
            }`}
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <button 
            onClick={handleNext}
            disabled={isEnd}
            className={`w-10 h-10 rounded-full border border-white/30 flex items-center justify-center transition ${
              isEnd 
                ? 'opacity-50 cursor-not-allowed bg-transparent' 
                : 'bg-gradient-to-r from-yellow-400 to-blue-400 cursor-pointer'
            }`}
          >
            <ArrowRight className={`${isEnd ? 'text-white' : 'text-black'}`} size={20} />
          </button>
        </div>

        {/* Swiper Slider */}
        <div className="mt-12">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={handleSlideChange}
            className="mentor-swiper"
          >
            {mentors.map((mentor, idx) => (
              <SwiperSlide key={idx}>
                <div className="rounded-xl overflow-hidden bg-gray-900 text-white flex flex-col shadow-md h-full">
                  {/* Image */}
                  <div className="bg-[#fff6e5] flex justify-center items-center h-48 flex-shrink-0">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-[16px] line-clamp-1">{mentor.name}</h3>
                      <p className="text-sm text-white/80 line-clamp-1">{mentor.role}</p>
                      <p className="text-sm font-medium line-clamp-1">{mentor.company}</p>
                    </div>
                    <p className="text-xs text-white/70 mt-2">
                      Successful Sessions:{" "}
                      <span className="font-semibold text-white">
                        {mentor.sessions.toString().padStart(3, "0")}
                      </span>
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Mobile pagination dots */}
        <div className="flex justify-center mt-6 md:hidden">
          <div className="swiper-pagination-custom flex space-x-2"></div>
        </div>
      </div>

      <style jsx global>{`
        .mentor-swiper .swiper-slide {
          height: auto;
        }
        
        .mentor-swiper {
          padding-bottom: 20px;
        }
        
        /* Hide default swiper pagination on desktop */
        @media (min-width: 768px) {
          .swiper-pagination {
            display: none !important;
          }
        }
        
        /* Custom pagination styles for mobile */
        @media (max-width: 767px) {
          .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            background: rgba(255, 255, 255, 0.3);
            opacity: 1;
          }
          
          .swiper-pagination-bullet-active {
            background: white;
          }
          
          .swiper-pagination {
            bottom: 0 !important;
            position: static !important;
            text-align: center;
            margin-top: 20px;
          }
        }
        
        /* Text clamp utilities */
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
};

export default MentorCards;
