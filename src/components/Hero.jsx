
import { useEffect, useRef } from "react";

const Hero = () => {
  const heroRef = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const moveX = (x - 0.5) * 15;
      const moveY = (y - 0.5) * 15;
      
      const chartElements = heroRef.current.querySelectorAll('.chart-line');
      
      chartElements.forEach((line, index) => {
        const factor = (index + 1) * 0.1;
        line.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <section ref={heroRef} className="relative h-screen flex items-center">
      {/* Financial data grid background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Candlestick chart elements */}
        <div className="chart-line absolute left-0 top-1/4 w-full h-px bg-cyan-500/20"></div>
        <div className="chart-line absolute left-0 top-1/3 w-full h-px bg-cyan-500/10"></div>
        <div className="chart-line absolute left-0 top-1/2 w-full h-px bg-cyan-500/20"></div>
        <div className="chart-line absolute left-0 top-2/3 w-full h-px bg-cyan-500/10"></div>
        <div className="chart-line absolute left-0 top-3/4 w-full h-px bg-cyan-500/20"></div>
        
        {/* Accent elements */}
        <div className="absolute top-1/3 left-1/5 w-2 h-2 rounded-full bg-red-500/50 blur-sm"></div>
        <div className="absolute top-2/3 left-1/4 w-3 h-3 rounded-full bg-cyan-500/50 blur-sm"></div>
        <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-red-500/30 blur-md"></div>
      </div>
      
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        {/* Left side with chart visualization */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          <div className="relative w-full">
            {/* Stock price numbers */}
            <div className="absolute top-1/4 right-1/4 text-red-500 font-mono text-2xl font-bold opacity-80">
              326.91
              <span className="text-red-500 text-xl ml-2">▼</span>
            </div>
            <div className="absolute bottom-1/3 left-1/4 text-red-500 font-mono text-2xl font-bold opacity-80">
              597.55
              <span className="text-red-500 text-xl ml-2">▼</span>
            </div>
            
            {/* Candlestick chart */}
            <svg className="w-full h-[500px]" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
              {/* Grid lines */}
              {Array.from({ length: 10 }).map((_, i) => (
                <line 
                  key={`v-${i}`} 
                  x1={i * 50} 
                  y1="0" 
                  x2={i * 50} 
                  y2="400" 
                  stroke="#1e3a5f" 
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <line 
                  key={`h-${i}`} 
                  x1="0" 
                  y1={i * 50} 
                  x2="500" 
                  y2={i * 50} 
                  stroke="#1e3a5f" 
                  strokeWidth="1"
                />
              ))}
              
              {/* Candlestick patterns */}
              <g className="candlesticks">
                {/* Red candle */}
                <line x1="50" y1="100" x2="50" y2="200" stroke="#ff4560" strokeWidth="2" />
                <rect x="45" y="120" width="10" height="60" fill="#ff4560" />
                
                {/* Green candle */}
                <line x1="80" y1="180" x2="80" y2="280" stroke="#00e396" strokeWidth="2" />
                <rect x="75" y="180" width="10" height="60" fill="#00e396" />
                
                {/* Red candle */}
                <line x1="110" y1="150" x2="110" y2="250" stroke="#ff4560" strokeWidth="2" />
                <rect x="105" y="150" width="10" height="60" fill="#ff4560" />
                
                {/* White candle (main prominent one) */}
                <line x1="140" y1="100" x2="140" y2="300" stroke="white" strokeWidth="3" />
                <rect x="135" y="120" width="10" height="150" fill="white" opacity="0.8" />
                
                {/* Red candle */}
                <line x1="170" y1="160" x2="170" y2="220" stroke="#ff4560" strokeWidth="2" />
                <rect x="165" y="160" width="10" height="40" fill="#ff4560" />
                
                {/* Green candle */}
                <line x1="200" y1="140" x2="200" y2="220" stroke="#00e396" strokeWidth="2" />
                <rect x="195" y="180" width="10" height="40" fill="#00e396" />
                
                {/* Red candle */}
                <line x1="230" y1="120" x2="230" y2="210" stroke="#ff4560" strokeWidth="2" />
                <rect x="225" y="120" width="10" height="60" fill="#ff4560" />
                
                {/* White candle (main prominent one) */}
                <line x1="260" y1="80" x2="260" y2="240" stroke="white" strokeWidth="3" />
                <rect x="255" y="100" width="10" height="120" fill="white" opacity="0.8" />
                
                {/* More candlesticks continuing the pattern */}
                <line x1="290" y1="120" x2="290" y2="180" stroke="#ff4560" strokeWidth="2" />
                <rect x="285" y="120" width="10" height="40" fill="#ff4560" />
                
                <line x1="320" y1="100" x2="320" y2="200" stroke="#00e396" strokeWidth="2" />
                <rect x="315" y="140" width="10" height="60" fill="#00e396" />
              </g>
              
              {/* Data points overlay */}
              <g className="data-points">
                {Array.from({ length: 20 }).map((_, i) => (
                  <circle 
                    key={i} 
                    cx={25 + i * 24} 
                    cy={140 + Math.sin(i * 0.8) * 50} 
                    r="1" 
                    fill="#0ff" 
                    opacity="0.4"
                  />
                ))}
              </g>
              
              {/* Line chart overlay */}
              <polyline 
                points="25,180 49,160 73,170 97,155 121,180 145,165 169,190 193,170 217,160 241,150 265,165 289,145 313,160 337,140 361,155" 
                fill="none" 
                stroke="#0ff" 
                strokeWidth="1.5" 
                opacity="0.4"
              />
            </svg>
          </div>
        </div>
        
        {/* Right side with text content */}
        <div className="flex flex-col justify-center text-center lg:text-right">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
            NextGEN <span className="text-primary">Investments</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-medium mb-8 animate-fade-in stagger-1">
            Build Wealth
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-end gap-4 animate-fade-in stagger-2">
            <button className="h-12 px-8 bg-primary text-primary-foreground rounded-md font-medium shadow-sm transition-apple hover:shadow-md hover:bg-primary/90 active:scale-[0.98]">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
