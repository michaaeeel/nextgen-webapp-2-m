import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import CoursesAndPricing from "./pages/CoursesAndPricing";
import Dashboard from "./pages/Dashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import CoursesPage from "./pages/CoursesPage";
import CourseCreatePage from "./pages/CourseCreatePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CourseEditPage from "./pages/CourseEditPage";
import AdminDashboard from "./pages/AdminDashboard";
import UsersPage from "./pages/UsersPage";
import RoleRequestsPage from "./pages/RoleRequestsPage";
import "./App.css";
import ProtectedRoute from './components/ProtectedRoute';
import { RBACProvider } from './contexts/RBACContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <RBACProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<CoursesAndPricing />} />
              
              {/* Student Route */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Instructor Routes */}
              <Route 
                path="/instructor-dashboard" 
                element={
                  <ProtectedRoute requiredRole="instructor">
                    <InstructorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/instructor-dashboard/courses" 
                element={
                  <ProtectedRoute requiredRole="instructor">
                    <CoursesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/instructor-dashboard/courses/new" 
                element={
                  <ProtectedRoute requiredRole="instructor">
                    <CourseCreatePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/instructor-dashboard/courses/:courseId" 
                element={
                  <ProtectedRoute requiredRole="instructor">
                    <CourseDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/instructor-dashboard/courses/:courseId/edit" 
                element={
                  <ProtectedRoute requiredRole="instructor">
                    <CourseEditPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard/users" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <UsersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard/role-requests" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <RoleRequestsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RBACProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
