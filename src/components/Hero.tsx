
import { useEffect, useRef } from "react";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;
      
      const circleElements = heroRef.current.querySelectorAll('.hero-circle');
      
      circleElements.forEach((circle, index) => {
        const factor = (index + 1) * 0.1;
        (circle as HTMLElement).style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <section ref={heroRef} className="relative pt-36 pb-24 overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-circle absolute top-1/4 right-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-secondary/50 to-secondary/0 blur-3xl transition-transform duration-700 ease-apple"></div>
        <div className="hero-circle absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-secondary/70 to-secondary/0 blur-3xl transition-transform duration-700 ease-apple"></div>
        <div className="hero-circle absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-secondary/60 to-secondary/0 blur-3xl transition-transform duration-700 ease-apple"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 animate-fade-in">
            <span className="py-1 px-4 bg-secondary text-sm font-medium rounded-full">
              Introducing nextGEN
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-8 animate-slide-up text-balance">
            The future of design <br />
            <span className="text-gradient">reimagined</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up stagger-1 text-pretty">
            Discover a new standard in minimalist design — where simplicity meets functionality in perfect balance.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-slide-up stagger-2">
            <button className="w-full sm:w-auto h-14 px-8 bg-primary text-primary-foreground rounded-full font-medium shadow-sm transition-apple hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
              Get Started
            </button>
            <button className="w-full sm:w-auto h-14 px-8 bg-secondary text-secondary-foreground rounded-full font-medium shadow-sm transition-apple hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Hero image */}
        <div className="mt-20 relative max-w-5xl mx-auto animate-slide-up stagger-3">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-elegant">
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/0 z-10"></div>
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse-subtle">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"></path>
              </svg>
            </div>
            <svg className="w-full h-full" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg">
              <rect width="1600" height="900" fill="#f5f5f7" />
              <path d="M0,450 C400,400 800,600 1600,450 L1600,900 L0,900 Z" fill="#ebeced" />
              <circle cx="800" cy="450" r="100" fill="#e6e6e8" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
