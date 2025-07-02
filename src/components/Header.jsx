
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRBAC } from '@/contexts/RBACContext';
import RoleBasedElement from './RoleBasedElement';
import { ChevronDown, Users, Mail, ClipboardList, LayoutDashboard, Book } from "lucide-react";
import { getUserProfile } from "@/lib/supabase/users";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { userRole } = useRBAC();

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

  useEffect(() => {
    if (user?.id) {
      getUserProfile(user.id)
        .then(data => setProfile(data))
        .catch(error => console.error('Error fetching profile:', error));
    }
  }, [user?.id]);

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
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="text-base font-medium text-white/90 hover:text-white transition-apple"
            >
              Get Started
            </Link>
          )}
          <Link
            to="/courses"
            className="text-base font-medium text-white/90 hover:text-white transition-apple"
          >
            Courses and Pricing
          </Link>
          
          {isAuthenticated && (
            <>
              <RoleBasedElement requiredRole="student">
                <Link
                  to="/dashboard"
                  className="text-base font-medium text-white/90 hover:text-white transition-apple"
                >
                  Dashboard
                </Link>
              </RoleBasedElement>
              
              <RoleBasedElement requiredRole="instructor">
                <Link
                  to="/instructor-dashboard"
                  className="text-base font-medium text-white/90 hover:text-white transition-apple"
                >
                  Instructor Portal
                </Link>
              </RoleBasedElement>
              
              <RoleBasedElement requiredRole="admin">
                <div className="relative">
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className="flex items-center text-base font-medium text-white/90 hover:text-white transition-apple"
                    onBlur={() => setTimeout(() => setAdminMenuOpen(false), 100)}
                  >
                    Admin Console
                    <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", adminMenuOpen ? "rotate-180" : "")} />
                  </button>
                  
                  {adminMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg overflow-hidden z-20">
                      <div className="py-1">
                        <Link
                          to="/admin-dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setAdminMenuOpen(false)}
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          to="/admin-dashboard/users"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setAdminMenuOpen(false)}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          User Management
                        </Link>
                        <Link
                          to="/admin-dashboard/invitations"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setAdminMenuOpen(false)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Invitations
                        </Link>
                        <Link
                          to="/admin-dashboard/courses"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setAdminMenuOpen(false)}
                        >
                          <Book className="mr-2 h-4 w-4" />
                          Course Management
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </RoleBasedElement>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-white/90">
                Hello, {profile ? profile.first_name : 'User'}
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

      <div
        className={cn(
          "absolute top-full left-0 right-0 bg-primary shadow-lg transition-all duration-300 ease-apple overflow-hidden md:hidden",
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto px-6 py-6 space-y-4">
          {!isAuthenticated && (
            <Link
              to="/"
              className="block py-2 text-lg font-medium text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          )}
          <Link
            to="/courses"
            className="block py-2 text-lg font-medium text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Courses and Pricing
          </Link>
          {isAuthenticated && (
            <>
              <RoleBasedElement requiredRole="student">
                <Link
                  to="/dashboard"
                  className="block py-2 text-lg font-medium text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </RoleBasedElement>
              
              <RoleBasedElement requiredRole="instructor">
                <Link
                  to="/instructor-dashboard"
                  className="block py-2 text-lg font-medium text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Instructor Portal
                </Link>
              </RoleBasedElement>
              
              <RoleBasedElement requiredRole="admin">
                <div className="py-2">
                  <div className="text-lg font-medium text-white mb-2">Admin Console</div>
                  <div className="pl-4 border-l-2 border-white/20 space-y-2">
                    <Link
                      to="/admin-dashboard"
                      className="block py-1 text-base text-white/90 hover:text-white flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/admin-dashboard/users"
                      className="block py-1 text-base text-white/90 hover:text-white flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      User Management
                    </Link>
                    <Link
                      to="/admin-dashboard/invitations"
                      className="block py-1 text-base text-white/90 hover:text-white flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Invitations
                    </Link>
                    <Link
                      to="/admin-dashboard/courses"
                      className="block py-1 text-base text-white/90 hover:text-white flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Book className="mr-2 h-4 w-4" />
                      Course Management
                    </Link>
                  </div>
                </div>
              </RoleBasedElement>
            </>
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
