import React, { useState } from 'react';
import { Clock, Users, BookOpen, Calendar, Check, X, Clock3 } from 'lucide-react';

const CourseApprovalList = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Advanced JavaScript Development",
      instructor: "Sarah Johnson",
      category: "Programming",
      duration: "12 weeks",
      students: 245,
      lessons: 48,
      startDate: "2025-09-15",
      description: "Comprehensive course covering advanced JavaScript concepts, ES6+, async programming, and modern frameworks.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=240&fit=crop",
      status: "pending"
    },
    {
      id: 2,
      title: "Digital Marketing Fundamentals",
      instructor: "Mike Chen",
      category: "Marketing",
      duration: "8 weeks",
      students: 189,
      lessons: 32,
      startDate: "2025-08-20",
      description: "Learn the essentials of digital marketing including SEO, social media marketing, and content strategy.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop",
      status: "approved"
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      instructor: "Emily Rodriguez",
      category: "Design",
      duration: "10 weeks",
      students: 156,
      lessons: 40,
      startDate: "2025-09-01",
      description: "Complete guide to user interface and user experience design with hands-on projects and industry best practices.",
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=240&fit=crop",
      status: "pending"
    },
    {
      id: 4,
      title: "Data Science with Python",
      instructor: "David Park",
      category: "Data Science",
      duration: "16 weeks",
      students: 312,
      lessons: 64,
      startDate: "2025-10-05",
      description: "Comprehensive data science course covering Python, pandas, machine learning, and data visualization techniques.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=240&fit=crop",
      status: "Reject"
    },
    {
      id: 5,
      title: "Mobile App Development with Flutter",
      instructor: "Lisa Wang",
      category: "Mobile Development",
      duration: "14 weeks",
      students: 98,
      lessons: 56,
      startDate: "2025-09-10",
      description: "Build cross-platform mobile applications using Flutter and Dart programming language.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=240&fit=crop",
      status: "approved"
    },
    {
      id: 6,
      title: "Cloud Computing with AWS",
      instructor: "Robert Kim",
      category: "Cloud Computing",
      duration: "12 weeks",
      students: 167,
      lessons: 45,
      startDate: "2025-08-25",
      description: "Master Amazon Web Services including EC2, S3, Lambda, and deployment strategies for scalable applications.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=240&fit=crop",
      status: "pending"
    }
  ]);

  const updateCourseStatus = (courseId, newStatus) => {
    setCourses(courses.map(course => 
      course.id === courseId ? { ...course, status: newStatus } : course
    ));
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    
    switch (status) {
      case 'approved':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <Check className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case 'Reject':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <X className="w-4 h-4 mr-1" />
            Reject
          </span>
        );
      case 'pending':
      default:
        return (
          <span className={`${baseClasses} bg-amber-100 text-amber-800`}>
            <Clock3 className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
    }
  };

  const getActionButtons = (course) => {
    if (course.status === 'pending') {
      return (
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Approval List</h1>
          <p className="text-gray-600">Review and manage course submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <Check className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <Clock3 className="w-8 h-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <X className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Reject</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.status === 'Reject').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Cards */}
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row">
                {/* Course Image */}
                <div className="lg:w-80 lg:flex-shrink-0">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 lg:h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                  />
                </div>

                {/* Course Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{course.title}</h3>
                          <p className="text-gray-600">by {course.instructor}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:ml-4">
                          {getStatusBadge(course.status)}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 mb-4 leading-relaxed">{course.description}</p>

                      {/* Course Stats */}
                      <div className="flex flex-wrap gap-6 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="text-sm">{course.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-sm">{course.students} students</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span className="text-sm">{course.lessons} lessons</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">Starts {new Date(course.startDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="lg:ml-6 lg:flex-shrink-0">
                      {getActionButtons(course)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseApprovalList;