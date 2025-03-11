
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About NextGEN Investments</h1>
            
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="lead text-xl text-muted-foreground mb-8">
                NextGEN Investments was founded in 2020 with a mission to democratize financial education and empower individuals to take control of their financial future.
              </p>
              
              <h2 className="text-2xl font-bold mt-12 mb-4">Our Mission</h2>
              <p>
                At NextGEN Investments, we believe that everyone deserves access to high-quality financial education and investment tools. Our mission is to break down the barriers to financial literacy and provide our users with the knowledge and resources they need to make informed investment decisions.
              </p>
              
              <h2 className="text-2xl font-bold mt-12 mb-4">Our Team</h2>
              <p>
                Our team consists of experienced financial professionals, educators, and technology experts who are passionate about helping others achieve financial success. With decades of combined experience in the financial industry, our team brings a wealth of knowledge and expertise to the platform.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
                {/* Team Member 1 */}
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-card border-2 border-primary mx-auto mb-4 overflow-hidden">
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold">John Matthews</h3>
                  <p className="text-sm text-muted-foreground">CEO & Founder</p>
                </div>
                
                {/* Team Member 2 */}
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-card border-2 border-primary mx-auto mb-4 overflow-hidden">
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold">Sarah Williams</h3>
                  <p className="text-sm text-muted-foreground">Chief Investment Officer</p>
                </div>
                
                {/* Team Member 3 */}
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-card border-2 border-primary mx-auto mb-4 overflow-hidden">
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold">David Chen</h3>
                  <p className="text-sm text-muted-foreground">Head of Education</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mt-12 mb-4">Our Approach</h2>
              <p>
                We take a comprehensive approach to financial education, combining theoretical knowledge with practical application. Our courses are designed to be accessible to beginners while providing advanced strategies for experienced investors.
              </p>
              
              <h2 className="text-2xl font-bold mt-12 mb-4">Contact Us</h2>
              <p>
                Have questions or feedback? We'd love to hear from you! Contact our support team at <a href="mailto:support@nextgeninvestments.com" className="text-primary hover:text-primary/80">support@nextgeninvestments.com</a> or call us at +1 (555) 123-4567.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
