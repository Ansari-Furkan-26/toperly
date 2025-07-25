import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import AlumniVideoCard from './AlumniVideoCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const AlumniSection = () => {
  const swiperRef = useRef<SwiperType>();

  // Alumni data
  const alumniData = [
    {
      id: 1,
      name: "Anurag Bansal",
      program: "PGP TBM Co'23",
      company: "ZERODHA",
      position: "Founder's Office",
      image: "https://images.mastersunion.link/uploads/26062025/v1/shark3.webp",
      videoUrl: "#"
    },
    {
      id: 2,
      name: "Priya Sharma",
      program: "PGP TBM Co'22",
      company: "SWIGGY",
      position: "Product Manager",
      image: "https://images.mastersunion.link/uploads/26062025/v1/shark3.webp",
      videoUrl: "#"
    },
    {
      id: 3,
      name: "Rahul Kumar",
      program: "PGP TBM Co'21",
      company: "PAYTM",
      position: "Senior Analyst",
      image: "https://images.mastersunion.link/uploads/26062025/v1/shark3.webp",
      videoUrl: "#"
    },
    {
      id: 4,
      name: "Sneha Patel",
      program: "PGP TBM Co'23",
      company: "FLIPKART",
      position: "Business Lead",
      image: "https://images.mastersunion.link/uploads/26062025/v1/shark3.webp",
      videoUrl: "#"
    },
    {
      id: 5,
      name: "Arjun Singh",
      program: "PGP TBM Co'22",
      company: "BYJUS",
      position: "Growth Manager",
      image: "https://images.mastersunion.link/uploads/26062025/v1/shark3.webp",
      videoUrl: "#"
    }
  ];

  const handlePrevSlide = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNextSlide = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <section className="bg-black py-16 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-white text-2xl md:text-4xl font-medium mb-8">
            Hear Straight from <br />
            <span className="italic text-[#a6f1e1]">Our Alumni</span>
          </h2>
          
          {/* Navigation Buttons - Hidden on mobile */}
          <div className="hidden md:flex justify-center gap-4 mt-8">
            <button 
              onClick={handlePrevSlide}
              className="w-12 h-12 rounded-full border-2 border-gray-700 flex items-center justify-center text-white hover:border-[#a6f1e1] hover:bg-[#a6f1e1] hover:text-black transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNextSlide}
              className="w-12 h-12 rounded-full border-2 border-gray-700 flex items-center justify-center text-white hover:border-[#a6f1e1] hover:bg-[#a6f1e1] hover:text-black transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alumni Slider */}
        <div className="relative">
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-white !opacity-50',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-[#a6f1e1] !opacity-100',
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            className="alumni-swiper !pb-16"
          >
            {alumniData.map((alumni) => (
              <SwiperSlide key={alumni.id} className="!w-auto !flex !justify-center">
                <AlumniVideoCard alumni={alumni} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .alumni-swiper .swiper-slide {
          width: 25% !important;
          transition: all 0.3s ease !important;
          filter: blur(1px) !important;
          opacity: 0.7 !important;
          transform: scale(0.85) !important;
        }
        
        .alumni-swiper .swiper-slide-active {
          width: 50% !important;
          filter: none !important;
          opacity: 1 !important;
          transform: scale(1) !important;
        }
        
        .alumni-swiper .swiper-pagination {
          bottom: 0 !important;
          display: flex !important;
          justify-content: center !important;
          gap: 8px !important;
        }
        
        .alumni-swiper .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        
        .alumni-swiper .swiper-pagination-bullet-active {
          transform: scale(1.2) !important;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .alumni-swiper .swiper-slide {
            width: 80% !important;
            filter: none !important;
            opacity: 1 !important;
            transform: scale(1) !important;
          }
          
          .alumni-swiper .swiper-slide-active {
            width: 90% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AlumniSection;
