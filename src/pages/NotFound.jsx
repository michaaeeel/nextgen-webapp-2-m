
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="animate-fade-in">
            <h1 className="text-8xl font-medium mb-6">404</h1>
            <p className="text-xl text-muted-foreground mb-10">
              The page you're looking for doesn't exist.
            </p>
            <Link 
              to="/"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-apple hover:bg-primary/90"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
      
      <Footer className="mt-auto" />
    </div>
  );
};

export default NotFound;
