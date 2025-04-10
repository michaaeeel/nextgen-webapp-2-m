
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CourseProvider } from "./contexts/CourseContext";
import { RBACProvider } from './contexts/RBACContext';
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
import CourseEnrollmentPage from "./pages/CourseEnrollmentPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import AdminCourseCreatePage from "./pages/AdminCourseCreatePage";
import AdminCourseDetailPage from "./pages/AdminCourseDetailPage";
import AdminCourseEditPage from "./pages/AdminCourseEditPage";
import AdminCourseAssignInstructorPage from "./pages/AdminCourseAssignInstructorPage";
import UsersPage from "./pages/UsersPage";
import InvitationsPage from "./pages/InvitationsPage";
import AcceptInvitationPage from "./pages/AcceptInvitationPage";
import NewInvitationPage from "@/pages/NewInvitationPage";
import StudentCourseViewPage from "@/pages/StudentCourseViewPage";
import "./App.css";
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <RBACProvider>
        <CourseProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<CoursesAndPricing />} />
            <Route path="/course-enrollment/:courseId" element={<CourseEnrollmentPage />} />
            <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
            <Route path="/new-invitation" element={<NewInvitationPage />} />
            
            {/* Student Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRole="student">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/courses/:courseId" 
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentCourseViewPage />
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
              path="/admin-dashboard/invitations" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <InvitationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard/invitations/new" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <NewInvitationPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Course Management Routes */}
            <Route 
              path="/admin-dashboard/courses" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCoursesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard/courses/create" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCourseCreatePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard/courses/:courseId" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCourseDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard/courses/:courseId/edit" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCourseEditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard/courses/:courseId/assign-instructor" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCourseAssignInstructorPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CourseProvider>
      </RBACProvider>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
