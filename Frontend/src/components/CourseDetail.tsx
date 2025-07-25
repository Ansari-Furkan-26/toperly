// components/CourseDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Users, Star, BookOpen, Award, Lock } from 'lucide-react';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (user && course) {
      checkEnrollment(course);
    }
  }, [user, course]);

  // Disable right-click, text selection, and developer tools shortcuts
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleSelectStart = (e) => {
      // Disable text selection on video elements
      if (e.target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e) => {
      // Disable dragging of video elements
      if (e.target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  const showToast = (message, type = 'info') => {
    setToastMessage({ text: message, type });
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/courses/${courseId}`);
      
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
        
        if (data.videos && data.videos.length > 0) {
          setCurrentVideo(data.videos[0]);
        }
      } else {
        console.error('Failed to fetch course');
        showToast('Failed to fetch course details', 'error');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      showToast('Error loading course', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = (courseData) => {
    if (!user) {
      setIsEnrolled(false);
      return;
    }

    const enrollmentKey = `enrollment_${user.id}_${courseData._id}`;
    const savedEnrollment = localStorage.getItem(enrollmentKey);
    
    if (savedEnrollment) {
      setIsEnrolled(true);
      return;
    }

    if (courseData.price === 0) {
      setIsEnrolled(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!course) return;

    setEnrollmentLoading(true);

    try {
      if (course.price === 0) {
        const enrollmentKey = `enrollment_${user.id}_${course._id}`;
        const enrollmentData = {
          userId: user.id,
          courseId: course._id,
          enrolledAt: new Date().toISOString(),
          status: 'enrolled'
        };
        
        localStorage.setItem(enrollmentKey, JSON.stringify(enrollmentData));
        
        setIsEnrolled(true);
        showToast('Successfully enrolled in the course!', 'success');
        
        if (course.videos && course.videos.length > 0) {
          setCurrentVideo(course.videos[0]);
        }
      } else {
        showToast('Payment integration would be implemented here', 'info');
        const enrollmentKey = `enrollment_${user.id}_${course._id}`;
        const enrollmentData = {
          userId: user.id,
          courseId: course._id,
          enrolledAt: new Date().toISOString(),
          status: 'enrolled'
        };
        
        localStorage.setItem(enrollmentKey, JSON.stringify(enrollmentData));
        setIsEnrolled(true);
        showToast('Successfully enrolled in the course!', 'success');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      showToast('Failed to enroll in course', 'error');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const VideoPlayer = ({ video }) => {
    if (!video) {
      return (
        <div className="w-full h-64 md:h-96 bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <Play size={48} className="mx-auto mb-4 opacity-60" />
            <h3 className="text-lg font-semibold mb-2">No Video Selected</h3>
            <p className="text-gray-300">Select a lesson to start watching</p>
          </div>
        </div>
      );
    }

    if (!isEnrolled) {
      return (
        <div className="w-full bg-black rounded-lg overflow-hidden">
          <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gray-900 relative">
            {course.thumbnail?.url && (
              <img 
                src={course.thumbnail.url} 
                alt="Course thumbnail"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              />
            )}
            <div className="text-center text-white relative z-10">
              <Lock size={48} className="mx-auto mb-4 opacity-60" />
              <h3 className="text-lg font-semibold mb-2">Content Locked</h3>
              <p className="text-gray-300 mb-4">Enroll in this course to access the videos</p>
              <button
                onClick={handleEnroll}
                disabled={enrollmentLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50"
              >
                {enrollmentLoading ? 'Enrolling...' : (course.price === 0 ? 'Enroll for Free' : 'Enroll Now')}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full bg-black rounded-lg overflow-hidden relative">
        {/* Video Protection Overlay (invisible but blocks interactions) */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ 
            background: 'transparent',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        />
        
        <video
          key={video.url}
          controls
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          className="w-full h-64 md:h-96"
          poster={course.thumbnail?.url}
          onContextMenu={(e) => {
            e.preventDefault();
            return false;
          }}
          onLoadStart={() => console.log('Video loading started:', video.url)}
          onError={(e) => {
            console.error('Video load error:', e);
            showToast('Error loading video', 'error');
          }}
          style={{ 
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
          // Disable drag and drop
          onDragStart={(e) => e.preventDefault()}
          // Additional protection attributes
          preload="metadata"
          crossOrigin="anonymous"
        >
          <source src={video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="bg-gray-800 text-white p-3" style={{ userSelect: 'none' }}>
          <h4 className="font-medium">{video.title}</h4>
          <p className="text-sm text-gray-300">Lesson {video.order}</p>
        </div>

        {/* Copyright watermark */}
        <div className="absolute bottom-16 right-4 text-white text-xs opacity-50 pointer-events-none z-20">
          © Protected Content
        </div>
      </div>
    );
  };

  // Rest of your component remains the same...
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
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
    <div className="min-h-screen bg-gray-50" style={{ userSelect: 'none' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
          toastMessage.type === 'success' ? 'bg-green-600' : 
          toastMessage.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {toastMessage.text}
        </div>
      )}

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
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <VideoPlayer video={currentVideo} />

            {/* Course Info */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
              </div>

              <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
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
                  <Star size={16} className="mr-1 fill-current text-yellow-500" />
                  <span>4.8 (124 reviews)</span>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{course.description}</p>

              {course.instructor && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-2">Instructor</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">
                        {course.instructor.name.charAt(0)}
                      </span>
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Enrollment Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </div>
                {course.price > 0 && (
                  <div className="text-sm text-gray-500 line-through">$99.99</div>
                )}
              </div>

              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrollmentLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enrollmentLoading ? 
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Enrolling...
                    </div>
                    : (course.price === 0 ? 'Enroll for Free' : 'Enroll Now')
                  }
                </button>
              ) : (
                <div className="text-center py-3 bg-green-100 text-green-800 rounded-lg mb-4 font-medium">
                  ✓ Enrolled
                </div>
              )}

              <div className="text-center text-sm text-gray-600">
                <div className="flex items-center justify-center mb-2">
                  <Award size={16} className="mr-1" />
                  <span>Certificate of completion</span>
                </div>
                {course.price > 0 && (
                  <div>30-day money-back guarantee</div>
                )}
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Course Content</h3>
              
              {course.videos && course.videos.length > 0 ? (
                <div className="space-y-2">
                  {course.videos.map((video, index) => (
                    <div
                      key={video._id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        currentVideo?._id === video._id 
                          ? 'bg-blue-100 border border-blue-300' 
                          : isEnrolled 
                            ? 'hover:bg-gray-100' 
                            : 'hover:bg-gray-50 cursor-not-allowed opacity-75'
                      }`}
                      onClick={() => {
                        if (isEnrolled) {
                          setCurrentVideo(video);
                        } else {
                          showToast('Please enroll to access the videos', 'info');
                        }
                      }}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {isEnrolled ? (
                          <Play size={16} className="text-blue-600" />
                        ) : (
                          <Lock size={16} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {video.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          Lesson {video.order}
                        </div>
                      </div>
                      {currentVideo?._id === video._id && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No lessons available yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
