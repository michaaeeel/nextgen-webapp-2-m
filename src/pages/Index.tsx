
import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/Feature";
import ContentSection from "@/components/ContentSection";
import Footer from "@/components/Footer";

const Index = () => {
  // Features data with SVG icons
  const features = [
    {
      title: "Minimalist Design",
      description: "Clean interfaces that focus on essential elements, eliminating visual clutter for a more intuitive experience.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      ),
    },
    {
      title: "Responsive Framework",
      description: "Fluid layouts that automatically adapt to any device size, providing a consistent experience across all platforms.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
      ),
    },
    {
      title: "Intuitive Interactions",
      description: "Thoughtfully designed interactions that feel natural and effortless, enhancing the overall user experience.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"></path>
          <path d="M20 12H9l3-3m0 6l-3-3"></path>
        </svg>
      ),
    },
    {
      title: "Precision Typography",
      description: "Carefully selected fonts and typographic scales that enhance readability and visual hierarchy across all content.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7"></polyline>
          <line x1="9" y1="20" x2="15" y2="20"></line>
          <line x1="12" y1="4" x2="12" y2="20"></line>
        </svg>
      ),
    },
    {
      title: "Thoughtful Animation",
      description: "Subtle motion design that guides attention and provides visual feedback without being distracting.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
          <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <circle cx="12" cy="20" r="1"></circle>
        </svg>
      ),
    },
    {
      title: "Color Harmony",
      description: "Balanced color palettes that create visual interest while maintaining accessibility and emotional resonance.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="2.5"></circle>
          <circle cx="17.5" cy="10.5" r="2.5"></circle>
          <circle cx="8.5" cy="7.5" r="2.5"></circle>
          <circle cx="6.5" cy="12.5" r="2.5"></circle>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Hero />
        
        <FeaturesSection
          id="features"
          title="Designed with intention"
          subtitle="Every detail thoughtfully considered for an unparalleled experience"
          features={features}
        />
        
        <ContentSection
          id="products"
          title="Elevate your digital presence"
          subtitle="Product Experience"
          description="Our platform combines cutting-edge technology with timeless design principles to create digital experiences that feel intuitive and delightful. By focusing on essential elements and removing distractions, we help your content shine."
        >
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-apple hover:bg-primary/90">
              Explore Products
            </button>
            <button className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-secondary">
              View Documentation
            </button>
          </div>
        </ContentSection>
        
        <ContentSection
          id="about"
          title="Form follows function"
          subtitle="Our Philosophy"
          description="We believe that great design is as much about what you leave out as what you put in. By embracing simplicity and focusing on quality, we create experiences that respect your intelligence and your time."
          reversed
        />
        
        <section id="contact" className="py-24 bg-secondary/50">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-medium mb-4">Get in touch</h2>
              <p className="text-lg text-muted-foreground mb-10">
                Ready to elevate your digital experience? Contact us today.
              </p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <textarea
                  placeholder="Message"
                  rows={5}
                  className="w-full p-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                ></textarea>
                <button className="w-full md:w-auto h-12 px-8 bg-primary text-primary-foreground rounded-lg font-medium shadow transition-apple hover:bg-primary/90">
                  Send Message
                </button>
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
