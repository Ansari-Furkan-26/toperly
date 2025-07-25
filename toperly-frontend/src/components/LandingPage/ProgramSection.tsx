import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import ProgramCard from "./ProgramCard";
import type { Program, Tab } from "../types";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProgramsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "undergraduate" | "postgraduate" | "executive"
  >("undergraduate");
  
  const swiperRef = useRef<SwiperType>();

  const tabs: Tab[] = [
    {
      id: "undergraduate",
      label: "Undergraduate Programmes",
      value: "undergraduate",
    },
    {
      id: "postgraduate",
      label: "Postgraduate Programmes",
      value: "postgraduate",
    },
    { id: "executive", label: "Executive Programmes", value: "executive" },
  ];

  const programs: Program[] = [
    {
      id: 1,
      title: "UG Programme in Technology & Business Management",
      description:
        "Gain hands-on business experience with a globally accredited degree from Delhi University or Illinois Tech, US",
      image:
        "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=200&fit=crop",
      format: "On Campus (Opt-in Residential)",
      eligibility: "Class 12th Students & Pass-outs",
      duration: "4 Years",
      deadline: "June 30, 2025",
      category: "undergraduate",
    },
    {
      id: 2,
      title: "UG Programme in Psychology & Marketing",
      description:
        "Apply behavioural psychology to marketing with an accredited degree from Delhi University or Illinois Tech, US",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=200&fit=crop",
      format: "On Campus (Opt-in Residential)",
      eligibility: "Class 12th Students & Pass-outs",
      duration: "4 Years",
      deadline: "June 30, 2025",
      category: "undergraduate",
    },
    {
      id: 3,
      title: "UG Programme in Artificial Intelligence & Machine Learning",
      description:
        "Learn applied AI & ML with hands-on projects to earn an accredited degree from Delhi University or Illinois Tech, US",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop",
      format: "On Campus (Opt-in Residential)",
      eligibility: "Class 12th Students & Pass-outs",
      duration: "4 Years",
      deadline: "June 30, 2025",
      category: "undergraduate",
    },
    {
      id: 4,
      title: "MBA in Technology Management",
      description:
        "Advanced business education with technology focus for experienced professionals",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      format: "On Campus & Online",
      eligibility: "Graduates with 2+ years experience",
      duration: "2 Years",
      deadline: "August 15, 2025",
      category: "postgraduate",
    },
    {
      id: 5,
      title: "Executive Leadership Programme",
      description:
        "Intensive leadership development for senior management professionals",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
      format: "Blended Learning",
      eligibility: "Senior Executives",
      duration: "6 Months",
      deadline: "Rolling Admissions",
      category: "executive",
    },
    {
      id: 6,
      title: "Advanced Data Science Programme",
      description:
        "Master data science with real-world projects and industry mentorship",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
      format: "Online & Hybrid",
      eligibility: "Graduates with technical background",
      duration: "18 Months",
      deadline: "September 30, 2025",
      category: "postgraduate",
    },
  ];

  const filteredPrograms = programs.filter(
    (program) => program.category === activeTab
  );

  const handlePrevSlide = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNextSlide = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <section className="bg-gray-900 min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="font-merriweather text-4xl md:text-5xl text-white mb-8">
            Our <em className="not-italic">Programmes</em>
          </h2>

          {/* Tabs and Navigation */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Tabs - Mobile optimized */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.value)}
                  className={clsx(
                    "font-inter font-medium transition-all duration-300 text-center",
                    // Mobile styles - smaller padding, equal width, smaller text
                    "px-3 py-2 text-sm rounded-lg sm:px-6 sm:py-3 sm:text-base sm:rounded-xl",
                    // Equal width on mobile
                    "flex-1 sm:flex-none",
                    activeTab === tab.value
                      ? "bg-white text-gray-900"
                      : "bg-transparent text-white border-2 border-transparent hover:border-toperly-teal hover:bg-gray-800"
                  )}
                >
                  {/* Shorter labels on mobile */}
                  <span className="sm:hidden">
                    {tab.label.split(' ')[0]}
                  </span>
                  <span className="hidden sm:inline">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation Buttons - Hidden on mobile */}
            <div className="hidden md:flex gap-3">
              <button 
                onClick={handlePrevSlide}
                className="w-12 h-12 rounded-full border-2 border-gray-700 flex items-center justify-center text-white hover:border-toperly-teal hover:bg-toperly-teal hover:text-gray-900 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNextSlide}
                className="w-12 h-12 rounded-full border-2 border-gray-700 flex items-center justify-center text-white hover:border-toperly-teal hover:bg-toperly-teal hover:text-gray-900 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Programs Slider */}
        {filteredPrograms.length > 0 ? (
          <div className="relative">
            <Swiper
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={32}
              slidesPerView={1}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-white !opacity-50',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-toperly-teal !opacity-100',
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={filteredPrograms.length > 3}
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
                  slidesPerView: 2,
                  spaceBetween: 32,
                },
                1280: {
                  slidesPerView: 3,
                  spaceBetween: 32,
                },
              }}
              className="programs-swiper !pb-0 md:!pb-12"
            >
              {filteredPrograms.map((program) => (
                <SwiperSlide key={program.id}>
                  <ProgramCard program={program} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg font-inter">
              No programmes available in this category yet.
            </p>
          </div>
        )}
      </div>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .programs-swiper .swiper-pagination {
          bottom: 0 !important;
          display: flex !important;
          justify-content: center !important;
          gap: 8px !important;
        }
        
        .programs-swiper .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        
        .programs-swiper .swiper-pagination-bullet-active {
          transform: scale(1.2) !important;
        }
        
        .programs-swiper .swiper-slide {
          height: auto !important;
          display: flex !important;
        }
        
        .programs-swiper .swiper-slide > div {
          width: 100% !important;
          height: 100% !important;
        }

        /* Hide pagination indicators on mobile */
        @media (max-width: 767px) {
          .programs-swiper .swiper-pagination {
            display: none !important;
          }
        }
        
        /* Show pagination indicators on tablet and desktop */
        @media (min-width: 768px) {
          .programs-swiper .swiper-pagination {
            display: flex !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ProgramsSection;
