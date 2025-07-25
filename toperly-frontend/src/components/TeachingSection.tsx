import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, BookOpen, Award } from "lucide-react";

const TeachingSection = () => {
  return (
    <section className="py-20 bg-toperly-light-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Teach With Toperly
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Share your expertise with thousands of eager learners worldwide. 
              Join our community of expert instructors and help shape the future 
              of AI education while building your personal brand.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-toperly-blue rounded-full p-2">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Reach Global Audience</h4>
                  <p className="text-gray-700">Connect with students from around the world</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-toperly-teal rounded-full p-2">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Create Impact</h4>
                  <p className="text-gray-700">Transform careers and shape the future of AI</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 rounded-full p-2">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Earn Recognition</h4>
                  <p className="text-gray-700">Build your reputation as an industry expert</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-toperly-blue hover:bg-toperly-navy">
              Become an Instructor
            </Button>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="space-y-6">
            <Card className="p-6 bg-white border-0 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-toperly-blue mb-2">500+</div>
                <p className="text-gray-700">Expert Instructors</p>
              </div>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-toperly-teal mb-2">50,000+</div>
                <p className="text-gray-700">Active Students</p>
              </div>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">4.9★</div>
                <p className="text-gray-700">Average Rating</p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card text-white border-0 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">₹15L+</div>
                <p>Average Instructor Earnings</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeachingSection;