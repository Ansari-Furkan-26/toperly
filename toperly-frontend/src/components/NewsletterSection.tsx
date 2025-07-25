import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewsletterSection = () => {
  return (
    <section className="py-20 bg-gradient-card relative overflow-hidden">
      <div className="absolute inset-0 bg-toperly-navy/90"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Be The First To Know
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and get the latest updates on AI trends, 
          new course launches, and exclusive content from industry experts.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input 
            placeholder="Enter your email address"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-toperly-teal"
          />
          <Button className="bg-toperly-teal hover:bg-toperly-blue px-8 whitespace-nowrap">
            Subscribe Now
          </Button>
        </div>
        
        <p className="text-sm text-gray-400 mt-4">
          No spam, unsubscribe at any time. Privacy policy applies.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;