import Footer from "@/components/Footer";
import FacultyModel from "@/components/LandingPage/FacultyModel";
import HeroSection from "@/components/LandingPage/HeroSection";
import Navbar from "@/components/LandingPage/Navbar";
import ScrollTimeline from "@/components/LandingPage/ScrollTimeline";
import ThoughtLeadership from "@/components/LandingPage/ThoughtLeadership";
import TopCourses from "@/components/LandingPage/AdmissionsSection";
import MentorCards from "@/components/LandingPage/MentorCards";
import MentorAccessSection from "@/components/LandingPage/MentorAccessSection";
import VideoPitchSection from "@/components/LandingPage/VideoPitchSection";
import ProgramsSection from "@/components/LandingPage/ProgramSection";
import AlumniVideoCard from "@/components/LandingPage/AlumniVideoCard";
import AlumniSection from "@/components/LandingPage/AlumniSection";

const Index2 = () => {
  return (
    <div className="min-h-screen font-inter">
      <Navbar/>
      <HeroSection/>
      <TopCourses/>
      <ProgramsSection/>
      <ScrollTimeline/>
      {/* <ThoughtLeadership/> */}
      <FacultyModel/>
      <MentorAccessSection/>
      <MentorCards/>
      <VideoPitchSection/>
      {/* <AlumniSection/> */}
      <Footer/>
    </div>
  );
};

export default Index2;
