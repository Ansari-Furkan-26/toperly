import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

interface Program {
  id: number;
  image: string;
  badge: string;
  duration: string;
  title: string;
  status: string;
  statusType: 'open' | 'closed';
}

const programs: Program[] = [
  {
    id: 1,
    image: 'https://files.mastersunion.link/media/img/ugProgramme.webp',
    badge: 'ON CAMPUS',
    duration: '4 YEARS',
    title: 'UG Programme in Tech & Business Management',
    status: 'Admissions Closed',
    statusType: 'closed',
  },
  {
    id: 2,
    image: 'https://files.mastersunion.link/media/img/ugProgramme.webp',
    badge: 'ON CAMPUS',
    duration: '4 YEARS',
    title: 'UG Programme in Psychology',
    status: 'Admissions Closed',
    statusType: 'closed',
  },
  {
    id: 3,
    image: 'https://files.mastersunion.link/media/img/ugProgramme.webp',
    badge: 'ON CAMPUS',
    duration: '4 YEARS',
    title: 'UG Programme in Data Science',
    status: 'Admissions Open',
    statusType: 'open',
  },
  {
    id: 4,
    image: 'https://files.mastersunion.link/media/img/ugProgramme.webp',
    badge: 'ON CAMPUS',
    duration: '4 YEARS',
    title: 'UG Programme in Business Analytics',
    status: 'Admissions Open',
    statusType: 'open',
  },
  {
    id: 5,
    image: 'https://files.mastersunion.link/media/img/ugProgramme.webp',
    badge: 'ON CAMPUS',
    duration: '4 YEARS',
    title: 'UG Programme in Digital Marketing',
    status: 'Admissions Open',
    statusType: 'open',
  },
  {
    id: 6,
    image: 'https://files.mastersunion.link/media/img/ugProgramme.webp',
    badge: 'ON CAMPUS',
    duration: '4 YEARS',
    title: 'UG Programme in Artificial Intelligence',
    status: 'Admissions Open',
    statusType: 'open',
  },
];

const tabs = ['Admissions', 'Latest News'];

const AdmissionsSection = () => {
  const [activeTab, setActiveTab] = useState('Admissions');
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd]   = useState(false);

  const swiperRef = useRef<any>(null);

  /* ----- arrow helpers ----- */
  const slidePrev = () => swiperRef.current?.slidePrev();
  const slideNext = () => swiperRef.current?.slideNext();
  const onSlideChange = (swiper: any) => {
    setAtStart(swiper.isBeginning);
    setAtEnd(swiper.isEnd);
  };

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Tabs and Arrows */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          {/* Tabs */}
          <div className="flex mb-4 sm:mb-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium rounded-lg mr-2 transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-black shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-black hover:bg-white'
                }`}
              >
                {tab === 'Admissions' && (
                  <span className="inline-block w-4 h-4 mr-2">
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-full h-full"
                    >
                      <path d="M2 2h12v12H2V2zm1 1v10h10V3H3zm2 2h6v1H5V5zm0 2h6v1H5V7zm0 2h4v1H5V9z" />
                    </svg>
                  </span>
                )}
                {tab}
              </button>
            ))}
          </div>

          {/* Desktop arrows */}
          <div className="hidden md:flex space-x-2">
            <button
              onClick={slidePrev}
              disabled={atStart}
              className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition-colors ${
                atStart
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={slideNext}
              disabled={atEnd}
              className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition-colors ${
                atEnd
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Swiper slider */}
        <Swiper
          modules={[Navigation]}
          // Keep one logical place to grab the instance:
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={onSlideChange}
          slidesPerView={1.15}   // a tiny peek on very small screens
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 2,  spaceBetween: 24 },
            768: { slidesPerView: 3,  spaceBetween: 24 },
            1024:{ slidesPerView: 4,  spaceBetween: 24 },
            1280:{ slidesPerView: 5,  spaceBetween: 24 },
          }}
          // drag/swipe is enabled automatically; arrows stay hidden on mobile
          className="pb-6"
        >
          {programs.map((program) => (
            <SwiperSlide key={program.id}>
              <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow select-none">
                {/* Image */}
                <div className="relative">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-48 sm:h-56 object-cover pointer-events-none"
                    draggable={false}
                  />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
                      {program.badge}
                    </span>
                    <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
                      {program.duration}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 leading-tight">
                    {program.title}
                  </h3>

                  {/* Status */}
                  <div className="flex items-center">
                    <div
                      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        program.statusType === 'closed'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-green-50 text-green-600'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          program.statusType === 'closed'
                            ? 'bg-red-500'
                            : 'bg-green-500'
                        }`}
                      ></div>
                      {program.status}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* mobile dots (built-in) */}
        <div className="swiper-pagination md:hidden" />
      </div>

      {/* Swiper injects its own navigation CSS—no custom scrollbar hiding required */}
    </div>
  );
};

export default AdmissionsSection;
