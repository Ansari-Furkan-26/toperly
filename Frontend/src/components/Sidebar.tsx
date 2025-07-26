import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GraduationCap,
  LogOut,
  BookOpen,
  DollarSign,
  Upload,
  Users,
  Star,
  Heart,
  Award,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  user: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
    language?: string;
    bio?: string;
    expertise?: string[];
  };
  logout: () => void;
}

export const Sidebar = ({ user, logout }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const instructorLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Course Management", icon: BookOpen, path: "/course-management" },
    { name: "My Courses", icon: BookOpen, path: "/courses" },
    { name: "Earnings", icon: DollarSign, path: "/earnings" },
    { name: "Upload Course", icon: Upload, path: "/upload-course" },
    { name: "Students", icon: Users, path: "/students" },
    { name: "Reviews", icon: Star, path: "/reviews" },
    { name: "Profile Settings", icon: Settings, path: "/profile-settings" },
  ];

  const studentLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "All Courses", icon: BookOpen, path: "/courses" },
    { name: "Enrolled Courses", icon: BookOpen, path: "/enrolled-courses" },
    { name: "Wishlist", icon: Heart, path: "/wishlist" },
    { name: "Certificates", icon: Award, path: "/certificates" },
    { name: "Profile Settings", icon: Settings, path: "/profile-settings" },
  ];

  const navLinks = user.role === "instructor" ? instructorLinks : studentLinks;

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-card shadow-card border-r flex flex-col">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EduPlatform
            </h1>
          </div>
        </div>
        <div className="flex-grow p-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <span className="font-medium text-lg">{user.name}</span>
              <div className="mt-2">
                <Badge
                  variant={user.role === "instructor" ? "default" : "secondary"}
                  className="text-sm"
                >
                  {user.role}
                </Badge>
              </div>
            </div>
            <nav className="mt-6 w-full">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Button
                      variant={
                        location.pathname === link.path ? "secondary" : "ghost"
                      }
                      className={`w-full justify-start text-left hover:bg-accent ${
                        location.pathname === link.path
                          ? "bg-accent text-accent-foreground font-semibold"
                          : ""
                      }`}
                      onClick={() => navigate(link.path)}
                    >
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className="p-6 border-t">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};
