import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, BookOpen } from 'lucide-react';

import VideoPlayer from './student/VideoPlayer';
import EnrollmentCard from './student/EnrollmentCard';
import CourseContentList from './student/CourseContentList';
import Toast from './student/Toast';

const API_BASE = 'http://localhost:5000/api';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userData) {
      setUser({...JSON.parse(userData), token});
    }
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (user && course) {
      checkEnrollment();
    }
  }, [user, course]);

  const showToast = (text, type = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}`);
      const data = await res.json();
      setCourse(data);
      if (data.videos?.length > 0) {
        setCurrentVideo(data.videos[0]);
      }
    } catch (err) {
      showToast('Failed to load course', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const res = await fetch(`${API_BASE}/students/${user.id}`);
      const data = await res.json();
      const isAlreadyEnrolled = data.enrolledCourses.some(
        (c) => c.courseId === course._id || c.courseId._id === course._id
      );
      setIsEnrolled(isAlreadyEnrolled);
    } catch (err) {
      console.error('Enrollment check failed:', err);
    }
  };

  const handleEnroll = async () => {
    if (!user) return navigate('/auth');

    try {
      console.log(user.token);
      setEnrollmentLoading(true);
      const res = await fetch(`${API_BASE}/students/enroll-course/${course._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      console.log()

      if (!res.ok) throw new Error('Failed to enroll');

      setIsEnrolled(true);
      showToast('Successfully enrolled!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Enrollment failed', 'error');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast message={toastMessage} />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Courses
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2">
            <VideoPlayer
              video={currentVideo}
              isEnrolled={isEnrolled}
              course={course}
              onEnroll={handleEnroll}
              enrollmentLoading={enrollmentLoading}
              showToast={showToast}
            />

            {/* Course Info */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.level === 'beginner'
                    ? 'bg-green-100 text-green-800'
                    : course.level === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{course.duration || 0} hours</span>
                </div>
                <div className="flex items-center">
                  <BookOpen size={16} className="mr-1" />
                  <span>{course.videos?.length || 0} lessons</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-1" />
                  <span>{course.enrolledStudents?.length || 0} students</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="mr-1 text-yellow-500" />
                  <span>4.8 (124 reviews)</span>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{course.description}</p>

              {course.instructor && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-2">Instructor</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4 text-white font-semibold">
                      {course.instructor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{course.instructor.name}</h4>
                      <p className="text-sm text-gray-600">{course.instructor.bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <EnrollmentCard
              course={course}
              isEnrolled={isEnrolled}
              onEnroll={handleEnroll}
              enrollmentLoading={enrollmentLoading}
            />

            <CourseContentList
              course={course}
              currentVideo={currentVideo}
              setCurrentVideo={setCurrentVideo}
              isEnrolled={isEnrolled}
              showToast={showToast}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
