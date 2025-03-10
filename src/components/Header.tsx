
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full py-4 transition-all duration-300 ease-apple",
        scrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a 
          href="#" 
          className="text-xl font-medium transition-apple hover:opacity-80"
        >
          nextGEN
        </a>

        <nav className="hidden md:flex items-center space-x-8">
          {["Features", "Products", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground hover-underline transition-apple hover:text-foreground"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button className="hidden md:flex items-center justify-center h-10 px-6 text-sm text-primary-foreground bg-primary rounded-full transition-apple hover:opacity-90">
            Get Started
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-2 text-foreground"
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col items-end space-y-1.5">
              <span 
                className={cn("block h-0.5 bg-current transition-all duration-300 ease-apple", 
                  mobileMenuOpen ? "w-6 translate-y-2 rotate-45" : "w-6"
                )}
              />
              <span 
                className={cn("block h-0.5 bg-current transition-all duration-300 ease-apple", 
                  mobileMenuOpen ? "opacity-0" : "w-4"
                )}
              />
              <span 
                className={cn("block h-0.5 bg-current transition-all duration-300 ease-apple", 
                  mobileMenuOpen ? "w-6 -translate-y-2 -rotate-45" : "w-5"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg shadow-lg transition-all duration-300 ease-apple overflow-hidden md:hidden",
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto px-6 py-6 space-y-4">
          {["Features", "Products", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block py-2 text-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <button className="w-full mt-4 flex items-center justify-center h-12 px-6 text-sm text-primary-foreground bg-primary rounded-full">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
