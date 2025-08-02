import { useAuth } from "@/contexts/AuthContext";
import { InstructorDashboard } from "./InstructorDashboard";
import { StudentDashboard } from "./StudentDashboard";

export const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {user.role === "instructor" ? <InstructorDashboard /> : <StudentDashboard />}
    </div>
  );
};
