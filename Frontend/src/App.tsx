import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// 🧰 UI Components
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

// 🧭 Route Wrappers
import StudentRoutes from "./contexts/StudentContext";
import InstructorRoutes from "./contexts/InstructorContext";

// 📄 Pages
import Index from "./pages/Index";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { Dashboard } from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// 🎓 Student Components
import CoursesCatalog from './components/CoursesCatalog';
import CourseDetail from './components/CourseDetail';
import QuizPage from "./components/student/QuizPage";
import EnrolledCourses from "./components/student/EnrolledCourses";
import Wishlist from "./components/student/Wishlist";

// 🎓 Instructor Components
import CourseManagementSystem from "./pages/Course";
import EnrolledStudents from "./pages/EnrolledStudents";
import AdminCoursesReviews from "./components/instructor/CoursesReviews";

// ⚙️ Common Pages
import { ProfileSettings } from "./components/ProfileSettings";
import { Notifications } from "./components/Notifications";
import HelpCenter from "./components/Helpcenter";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if unauthenticated
  if (!user) {
    navigate("/auth/login");
    return null;
  }

  // Check if the user is a student
  const isStudent = user.role === "student";

  return (
    <div className={`min-h-screen bg-gradient-subtle ${!isStudent ? 'ml-64' : ''} flex flex-col`}>
        {/* Show Navbar only for students */}
      {isStudent && <Navbar />}
      <div className="flex flex-1">
        {/* Sidebar only for non-students */}
        {!isStudent && <Sidebar user={user} logout={logout} />}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};


// 🧠 Main App Component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
            <Route path="/profile-settings" element={<ProtectedLayout><ProfileSettings /></ProtectedLayout>} />
            <Route path="/notifications" element={<ProtectedLayout><Notifications /></ProtectedLayout>} />
            <Route path="/helpcenter" element={<ProtectedLayout><HelpCenter /></ProtectedLayout>} />

            {/* Student Routes */}
            <Route path="/courses" element={<ProtectedLayout><StudentRoutes><CoursesCatalog /></StudentRoutes></ProtectedLayout>} />
            <Route path="/courses/:courseId" element={<ProtectedLayout><StudentRoutes><CourseDetail /></StudentRoutes></ProtectedLayout>} />
            <Route path="/courses/:courseId/quiz/:quizId" element={<ProtectedLayout><StudentRoutes><QuizPage /></StudentRoutes></ProtectedLayout>} />
            <Route path="/enrolled-courses" element={<ProtectedLayout><StudentRoutes><EnrolledCourses /></StudentRoutes></ProtectedLayout>} />
            <Route path="/wishlist" element={<ProtectedLayout><StudentRoutes><Wishlist /></StudentRoutes></ProtectedLayout>} />

            {/* Instructor Routes */}
            <Route path="/course-management" element={<ProtectedLayout><InstructorRoutes><CourseManagementSystem /></InstructorRoutes></ProtectedLayout>} />
            <Route path="/students" element={<ProtectedLayout><InstructorRoutes><EnrolledStudents /></InstructorRoutes></ProtectedLayout>} />
            <Route path="/review" element={<ProtectedLayout><InstructorRoutes><AdminCoursesReviews /></InstructorRoutes></ProtectedLayout>} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;