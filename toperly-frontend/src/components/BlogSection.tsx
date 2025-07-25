import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const BlogSection = () => {
  const blogPosts = [
    {
      title: "The Future of AI in Healthcare: Transforming Patient Care",
      excerpt: "Explore how artificial intelligence is revolutionizing healthcare with predictive analytics, personalized medicine, and automated diagnostics.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=center",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Healthcare AI"
    },
    {
      title: "Machine Learning in Finance: Risk Assessment and Fraud Detection",
      excerpt: "Discover how ML algorithms are being used to detect fraudulent transactions and assess financial risks in real-time.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center",
      date: "Dec 12, 2024", 
      readTime: "7 min read",
      category: "FinTech"
    },
    {
      title: "Building Ethical AI: Guidelines for Responsible Development",
      excerpt: "Learn about the principles and practices for developing AI systems that are fair, transparent, and accountable.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&crop=center",
      date: "Dec 10, 2024",
      readTime: "6 min read", 
      category: "AI Ethics"
    },
    {
      title: "Computer Vision Applications: From Autonomous Vehicles to Medical Imaging",
      excerpt: "Explore the diverse applications of computer vision technology across industries and its impact on daily life.",
      image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=250&fit=crop&crop=center",
      date: "Dec 8, 2024",
      readTime: "8 min read",
      category: "Computer Vision"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Insights From The Toperly Blog
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest trends in AI, machine learning, and emerging technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg group cursor-pointer">
              <div className="relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-toperly-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-toperly-blue transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-toperly-blue font-medium text-sm group-hover:text-toperly-navy">
                  <span>Read More</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="px-8">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;