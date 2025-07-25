import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const PricingSection = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start Learning Now
          </h2>
          <p className="text-lg text-gray-600">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <Card className="p-8 bg-white border-2 border-gray-200 hover:border-toperly-blue transition-colors">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter Plan</h3>
              <div className="text-4xl font-bold text-toperly-blue mb-2">₹2,999</div>
              <p className="text-gray-600">Perfect for beginners</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Access to 5 courses</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Basic support</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Certificate of completion</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Community access</span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Get Started
            </Button>
          </Card>

          {/* Prime Plan - Most Popular */}
          <Card className="p-8 bg-white border-2 border-toperly-blue relative hover:shadow-xl transition-shadow">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-toperly-blue text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>Most Popular</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Prime Plan</h3>
              <div className="text-4xl font-bold text-toperly-blue mb-2">₹6,999</div>
              <p className="text-gray-600">For serious learners</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Access to all courses</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Priority support</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">1-on-1 mentorship</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Job placement assistance</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Industry projects</span>
              </div>
            </div>

            <Button className="w-full bg-toperly-blue hover:bg-toperly-navy">
              Start Prime
            </Button>
          </Card>

          {/* Annual Plan */}
          <Card className="p-8 bg-white border-2 border-gray-200 hover:border-toperly-teal transition-colors">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Annual Plan</h3>
              <div className="text-4xl font-bold text-toperly-teal mb-2">₹49,999</div>
              <p className="text-gray-600">Best value for career growth</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Everything in Prime</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Advanced specializations</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Research project guidance</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Industry networking events</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Lifetime access</span>
              </div>
            </div>

            <Button variant="outline" className="w-full border-toperly-teal text-toperly-teal hover:bg-toperly-teal hover:text-white">
              Choose Annual
            </Button>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;