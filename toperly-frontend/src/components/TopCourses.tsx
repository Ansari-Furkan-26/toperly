import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users } from "lucide-react";

const TopCourses = () => {
  const courses = [
    {
      title: "Machine Learning Mastery",
      instructor: "Dr. Sarah Johnson",
      rating: 4.9,
      students: "12,500",
      duration: "12 weeks",
      price: "₹15,999",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&crop=center",
      category: "AI & ML",
    },
    {
      title: "Data Science Complete",
      instructor: "Prof. Rahul Mehta",
      rating: 4.8,
      students: "8,750",
      duration: "16 weeks",
      price: "₹18,999",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center",
      category: "Data Science",
    },
    {
      title: "AI for Business",
      instructor: "Emily Chen",
      rating: 4.9,
      students: "6,200",
      duration: "8 weeks",
      price: "₹12,999",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&crop=center",
      category: "Business AI",
    },
    {
      title: "Deep Learning Foundations",
      instructor: "Dr. Alex Kumar",
      rating: 4.7,
      students: "9,800",
      duration: "14 weeks",
      price: "₹21,999",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center",
      category: "Deep Learning",
    },
    {
      title: "NLP & Text Analytics",
      instructor: "Dr. Priya Patel",
      rating: 4.8,
      students: "5,400",
      duration: "10 weeks",
      price: "₹16,999",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center",
      category: "NLP",
    },
    {
      title: "Computer Vision Pro",
      instructor: "Prof. Michael Zhang",
      rating: 4.9,
      students: "7,100",
      duration: "12 weeks",
      price: "₹19,999",
      image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=250&fit=crop&crop=center",
      category: "Computer Vision",
    },
  ];

  return (
    <section className="py-20 bg-[#F9FAFB] font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-col md:flex-row mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-merriweather font-bold text-[#5409DA] mb-2">
              Browse Our Top Courses
            </h2>
            <p className="text-lg text-gray-600">
              Learn from industry experts and advance your career
            </p>
          </div>
          <Button
            variant="outline"
            className="hidden md:inline-flex border-[#5409DA] text-[#5409DA] hover:bg-[#5409DA]/10 transition"
          >
            View All Courses
          </Button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 bg-white"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#20D9C3] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                  {course.category}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  by {course.instructor}
                </p>

                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-[#5409DA]">
                    {course.price}
                  </div>
                  <Button className="bg-[#5409DA] hover:bg-[#4E71FF] text-white text-sm px-4 py-2 rounded-md transition">
                    Enroll Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-10 md:hidden">
          <Button
            variant="outline"
            className="w-full border-[#5409DA] text-[#5409DA] hover:bg-[#5409DA]/10"
          >
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopCourses;
