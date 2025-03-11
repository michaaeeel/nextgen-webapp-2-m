
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                Sign Out
              </button>
            </div>
            
            <div className="bg-card rounded-lg shadow-elegant p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>
              <p className="text-muted-foreground mb-4">You are not enrolled in any courses yet.</p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Browse Courses
              </button>
            </div>
            
            <div className="bg-card rounded-lg shadow-elegant p-8">
              <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <span className="ml-2">{user.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <span className="ml-2">{user.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Role:</span>
                  <span className="ml-2 capitalize">{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
