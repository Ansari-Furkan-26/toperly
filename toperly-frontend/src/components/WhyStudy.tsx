import { Card } from "@/components/ui/card";
import { Award, Clock, Globe } from "lucide-react";

const WhyStudy = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Study AI With Toperly
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Industry Expert */}
          <Card className="p-8 text-center bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-toperly-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Learn From Industry Experts
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our instructors are seasoned professionals with years of experience in top tech companies and research institutions. They bring real-world expertise directly to your learning journey.
            </p>
          </Card>

          {/* Flexible Learning */}
          <Card className="p-8 text-center bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-toperly-teal rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Flexible Learning Schedule
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Study at your own pace with our self-paced courses and live sessions. Whether you're working full-time or studying, we have options that fit your lifestyle and commitments.
            </p>
          </Card>

          {/* Global Recognition */}
          <Card className="p-8 text-center bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Globally Recognized Certificates
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Earn certificates that are recognized by leading companies worldwide. Our credentials validate your skills and help you stand out in the competitive AI job market.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyStudy;