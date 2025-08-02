import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Mail, 
  Phone, 
  Globe, 
  GraduationCap, 
  BookOpen,
  TrendingUp,
  Users
} from 'lucide-react';
import EnrolledCourses from '../components/student/EnrolledCourses';
import Course from './Course';
import CoursesCatalog from '@/components/CoursesCatalog';
import VdoPlayer from '@/components/VdoPlayer';

export const Dashboard = () => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarFallback className="bg-gradient-primary text-white text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <div className="flex justify-center mt-2">
                <Badge variant={user.role === 'instructor' ? 'default' : 'secondary'} className="text-sm">
                  {user.role === 'instructor' ? 'Instructor' : 'Student'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                
                {user.role === 'student' && (
                  <>
                    {user.phone && (
                      <div className="flex items-center space-x-3 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.language && (
                      <div className="flex items-center space-x-3 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="capitalize">{user.language}</span>
                      </div>
                    )}
                  </>
                )}
                
                {user.role === 'instructor' && user.bio && (
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                  </div>
                )}
                
                {user.role === 'instructor' && user.expertise && user.expertise.length > 0 && (
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.expertise.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.role === 'student' ? (
              <>
                <Card className="shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Enrolled Courses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-bold">12</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-secondary" />
                      <span className="text-2xl font-bold">8</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Certificates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-bold">5</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Courses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-bold">6</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-secondary" />
                      <span className="text-2xl font-bold">342</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Monthly Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-bold">$2,450</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Welcome Message */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>
                Welcome back, {user.name}! 👋
              </CardTitle>
              <CardDescription>
                {user.role === 'student' 
                  ? "Ready to continue your learning journey? Check out your enrolled courses below."
                  : "Ready to inspire minds today? Your students are waiting for your next lesson."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                  {user.role === 'student' ? 'Browse Courses' : 'Create New Course'}
                </Button>
                <Button variant="outline" className="transition-smooth">
                  {user.role === 'student' ? 'View Progress' : 'Analytics Dashboard'}
                </Button>
              </div>
            </CardContent>
          </Card>            
        </div>
      </div>
      {/* {user.role === 'student' ? <CoursesCatalog /> : <CoursesCatalog />} */}
      <VdoPlayer videoId="ff2dabcc6615d0d2a3177bdc0e4c6312" />

    </div>
  );
};