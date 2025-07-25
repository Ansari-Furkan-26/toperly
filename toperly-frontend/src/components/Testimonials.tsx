import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Arjun Reddy",
      role: "AI Engineer at Tesla",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Toperly's AI program completely transformed my career. The hands-on projects and expert mentorship helped me land my dream job at Tesla. The curriculum is cutting-edge and perfectly aligned with industry needs."
    },
    {
      name: "Sneha Kapoor", 
      role: "Data Scientist at Amazon",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The machine learning course at Toperly is outstanding. The instructors are incredibly knowledgeable and the practical approach to learning made complex concepts easy to understand. Highly recommended!"
    },
    {
      name: "Rohit Sharma",
      role: "ML Engineer at Google",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Thanks to Toperly, I was able to transition from a traditional software role to ML engineering. The comprehensive curriculum and career support made all the difference in my professional journey."
    },
    {
      name: "Priya Singh",
      role: "AI Research Scientist",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Toperly's deep learning program gave me the confidence to pursue AI research. The quality of education and the supportive community here is unmatched. I couldn't have asked for a better learning experience."
    },
    {
      name: "Vikram Gupta",
      role: "Product Manager at Microsoft",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The AI for Business course helped me understand how to implement AI solutions in product development. The strategic insights I gained have been invaluable in my role at Microsoft."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hear From Our Learners
          </h2>
          <p className="text-lg text-gray-600">
            Success stories from our AI and ML graduates
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg relative">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-toperly-blue/20" />
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;