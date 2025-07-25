import aiTechBg from "@/assets/ai-tech-bg.jpg";

const AISection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${aiTechBg})` }}
      >
        <div className="absolute inset-0 bg-toperly-navy/90"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            MAKING INDIA READY FOR
            <br />
            <span className="text-toperly-teal">THE FUTURE WITH AI</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Transform your career with comprehensive AI training programs. 
            Master machine learning, data science, and emerging technologies 
            that are shaping the future of work.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-toperly-blue/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <div className="text-toperly-teal text-2xl font-bold">AI</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Artificial Intelligence</h3>
              <p className="text-gray-300">Master AI fundamentals and applications</p>
            </div>
            
            <div className="text-center">
              <div className="bg-toperly-teal/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <div className="text-toperly-blue text-2xl font-bold">ML</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Machine Learning</h3>
              <p className="text-gray-300">Build intelligent systems and algorithms</p>
            </div>
            
            <div className="text-center">
              <div className="bg-toperly-blue/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <div className="text-toperly-teal text-2xl font-bold">DS</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Science</h3>
              <p className="text-gray-300">Extract insights from complex data</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;