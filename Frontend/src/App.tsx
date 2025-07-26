import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import CoursesCatalog from './components/CoursesCatalog';
import CourseDetail from './components/CourseDetail';
import Hub from "./pages/Hub";
import NotFound from "./pages/NotFound";
import { Sidebar } from "./components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import EnrolledCourses from "./components/student/EnrolledCourses";

const queryClient = new QueryClient();

// Layout component for protected routes with Sidebar
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      <Sidebar user={user} logout={logout} />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
            <Route path="/hub" element={<ProtectedLayout><Hub /></ProtectedLayout>} />
            <Route path="/courses" element={<ProtectedLayout><CoursesCatalog /></ProtectedLayout>} />
            <Route path="/courses/:courseId" element={<ProtectedLayout><CourseDetail /></ProtectedLayout>} />
            <Route path="/enrolled-courses" element={<ProtectedLayout><EnrolledCourses /></ProtectedLayout>} />
            <Route path="*" element={<ProtectedLayout><NotFound /></ProtectedLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;