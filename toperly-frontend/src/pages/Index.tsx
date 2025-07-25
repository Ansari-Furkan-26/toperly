import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AISection from "@/components/AISection";
import CareerOutcomes from "@/components/CareerOutcomes";
import TopCourses from "@/components/TopCourses";
import WhyStudy from "@/components/WhyStudy";
import Testimonials from "@/components/Testimonials";
import PricingSection from "@/components/PricingSection";
import TeachingSection from "@/components/TeachingSection";
import BlogSection from "@/components/BlogSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import ScrollTimeline from "@/components/ScrollTimeline";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
       <BackgroundBeamsWithCollision>
      <HeroSection />
      </BackgroundBeamsWithCollision>
      <ScrollTimeline/>
      <AISection />
      <CareerOutcomes />
      <TopCourses />
      <WhyStudy />
      <Testimonials />
      <PricingSection />
      <TeachingSection />
      <BlogSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
