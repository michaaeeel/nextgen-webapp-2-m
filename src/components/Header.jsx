import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-apple bg-primary",
        scrolled ? "shadow-md" : ""
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <Link 
          to="/" 
          className="text-xl font-semibold text-white transition-apple hover:opacity-90"
        >
          NextGEN Investments
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-base font-medium text-white/90 hover:text-white transition-apple"
          >
            Get Started
          </Link>
          <Link
            to="/courses"
            className="text-base font-medium text-white/90 hover:text-white transition-apple"
          >
            Courses and Pricing
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="text-base font-medium text-white/90 hover:text-white transition-apple"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-white/90">
                Hello, {user.raw_user_meta_data?.firstName || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="text-base font-medium text-white/90 hover:text-white transition-apple"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/signin" 
                className="text-base font-medium text-white/90 hover:text-white transition-apple"
              >
                Sign In
              </Link>
              <Link
                to="/about"
                className="text-base font-medium text-white/90 hover:text-white transition-apple"
              >
                About
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white"
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

      {/* Mobile menu */}
      <div
        className={cn(
          "absolute top-full left-0 right-0 bg-primary shadow-lg transition-all duration-300 ease-apple overflow-hidden md:hidden",
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto px-6 py-6 space-y-4">
          <Link
            to="/"
            className="block py-2 text-lg font-medium text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Started
          </Link>
          <Link
            to="/courses"
            className="block py-2 text-lg font-medium text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Courses and Pricing
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="block py-2 text-lg font-medium text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block py-2 text-lg font-medium text-white w-full text-left"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link
                to="/signin"
                className="block py-2 text-lg font-medium text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/about"
                className="block py-2 text-lg font-medium text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
