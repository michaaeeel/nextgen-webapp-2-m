
import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const Index = () => {
  // Investment features data
  const features = [
    {
      title: "Market Analysis",
      description: "Advanced tools to analyze market trends and make informed investment decisions.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="M18 9l-6-6-4 4-3 3"></path>
        </svg>
      ),
    },
    {
      title: "Portfolio Management",
      description: "Track and optimize your investment portfolio with real-time data and insights.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      ),
    },
    {
      title: "Risk Assessment",
      description: "Evaluate potential risks and protect your investments with our risk management system.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2s8 6 8 10v4c0 3-2 4-8 4s-8-1-8-4v-4c0-4 8-10 8-10z"></path>
          <path d="M9 16v-3"></path>
          <path d="M12 16v-6"></path>
          <path d="M15 16v-3"></path>
        </svg>
      ),
    },
    {
      title: "Financial Education",
      description: "Access a wealth of educational resources to enhance your financial knowledge.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          <line x1="12" y1="6" x2="17" y2="6"></line>
          <line x1="12" y1="10" x2="17" y2="10"></line>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-secondary">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Investment Tools</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our platform provides everything you need to make informed investment decisions and build long-term wealth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-card p-6 rounded-lg shadow-elegant hover-scale transition-apple"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section id="cta" className="py-20 bg-card">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Investment Journey?</h2>
              <p className="text-xl text-muted-foreground mb-10">
                Join thousands of investors who have already taken control of their financial future.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="h-14 px-8 bg-primary text-primary-foreground rounded-md font-medium shadow-sm transition-apple hover:shadow-md hover:bg-primary/90 active:scale-[0.98]">
                  Get Started
                </button>
                <button className="h-14 px-8 bg-secondary text-secondary-foreground rounded-md font-medium shadow-sm border border-border transition-apple hover:shadow-md hover:bg-secondary/90 active:scale-[0.98]">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Courses Section */}
        <section id="courses" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Courses and Pricing</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Explore our range of investment courses designed for all experience levels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Beginner Course */}
              <div className="bg-card p-8 rounded-lg shadow-elegant hover-scale transition-apple border border-border">
                <div className="text-primary font-bold mb-4">BEGINNER</div>
                <h3 className="text-2xl font-bold mb-2">Investment Fundamentals</h3>
                <p className="text-3xl font-bold mb-6">$199</p>
                <p className="text-muted-foreground mb-8">Learn the basics of investing and build a solid foundation for your investment journey.</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    10 comprehensive modules
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Beginner-friendly content
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    6 months access
                  </li>
                </ul>
                <button className="w-full h-12 bg-primary text-primary-foreground rounded-md font-medium shadow-sm transition-apple hover:shadow-md hover:bg-primary/90 active:scale-[0.98]">
                  Enroll Now
                </button>
              </div>
              
              {/* Intermediate Course */}
              <div className="bg-primary p-8 rounded-lg shadow-elegant hover-scale transition-apple transform scale-105 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
                <div className="text-white font-bold mb-4">INTERMEDIATE</div>
                <h3 className="text-2xl font-bold mb-2 text-white">Advanced Strategies</h3>
                <p className="text-3xl font-bold mb-6 text-white">$349</p>
                <p className="text-white/80 mb-8">Take your investing to the next level with advanced strategies and techniques.</p>
                <ul className="space-y-3 mb-8 text-left text-white">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    15 in-depth modules
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Portfolio optimization
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    12 months access
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    1-on-1 consultation
                  </li>
                </ul>
                <button className="w-full h-12 bg-white text-primary rounded-md font-medium shadow-sm transition-apple hover:shadow-md hover:bg-white/90 active:scale-[0.98]">
                  Enroll Now
                </button>
              </div>
              
              {/* Expert Course */}
              <div className="bg-card p-8 rounded-lg shadow-elegant hover-scale transition-apple border border-border">
                <div className="text-primary font-bold mb-4">EXPERT</div>
                <h3 className="text-2xl font-bold mb-2">Professional Trading</h3>
                <p className="text-3xl font-bold mb-6">$599</p>
                <p className="text-muted-foreground mb-8">Master complex trading strategies used by professional investors and institutions.</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    20 expert modules
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Advanced analysis tools
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Lifetime access
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Monthly group coaching
                  </li>
                </ul>
                <button className="w-full h-12 bg-primary text-primary-foreground rounded-md font-medium shadow-sm transition-apple hover:shadow-md hover:bg-primary/90 active:scale-[0.98]">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-secondary">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Hear from investors who have transformed their financial future with NextGEN Investments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-card p-6 rounded-lg shadow-elegant hover-scale transition-apple">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mr-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Retail Investor</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "NextGEN Investments has completely changed my approach to investing. The courses are clear, practical, and have helped me achieve a 15% return on my portfolio this year."
                </p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-card p-6 rounded-lg shadow-elegant hover-scale transition-apple">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mr-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold">Michael Chen</h4>
                    <p className="text-sm text-muted-foreground">Day Trader</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The Professional Trading course is exceptional. The advanced strategies and market analysis techniques have significantly improved my trading performance."
                </p>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-card p-6 rounded-lg shadow-elegant hover-scale transition-apple">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mr-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold">Emily Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">Financial Advisor</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "I recommend NextGEN Investments to all my clients. The platform provides excellent educational resources and tools that help investors make informed decisions."
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
