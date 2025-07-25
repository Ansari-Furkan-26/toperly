// components/CourseManagementSystem.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Upload, X, Play, Award, Edit, Save, ArrowLeft, Trash2 } from 'lucide-react';

const CourseManagementSystem = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'create', 'edit'
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Form state
  const [courseData, setCourseData] = useState({
    thumbnail: null,
    thumbnailUrl: '',
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    duration: 0,
    tags: '',
    lessons: [{ name: '', description: '', video: null, videoUrl: '' }],
    quizzes: [{
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }],
    certificate: {
      title: '',
      subtitle: ''
    }
  });
  
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  const API_BASE = 'http://localhost:5000/api';

  const getAuthToken = () => localStorage.getItem('token');
  const getCurrentUser = () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  };

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    fetchCourses();
  }, []);

  // Reset form data
  const resetFormData = () => {
    setCourseData({
      thumbnail: null,
      thumbnailUrl: '',
      title: '',
      description: '',
      category: '',
      level: 'beginner',
      price: 0,
      duration: 0,
      tags: '',
      lessons: [{ name: '', description: '', video: null, videoUrl: '' }],
      quizzes: [{
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }],
      certificate: {
        title: '',
        subtitle: ''
      }
    });
    setErrors({});
    setUploadProgress({});
  };

  // Populate form data for editing
  const populateFormForEdit = (course) => {
    setCourseData({
      thumbnail: null,
      thumbnailUrl: course.thumbnail?.url || '',
      title: course.title || '',
      description: course.description || '',
      category: course.category || '',
      level: course.level || 'beginner',
      price: course.price || 0,
      duration: course.duration || 0,
      tags: '',
      lessons: course.videos && course.videos.length > 0 ? [{
        name: course.videos[0].title || '',
        description: '',
        video: null,
        videoUrl: course.videos[0].url || '',
        bunnyFileId: course.videos[0].bunnyFileId || ''
      }] : [{ name: '', description: '', video: null, videoUrl: '' }],
      quizzes: [{
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }],
      certificate: {
        title: '',
        subtitle: ''
      }
    });
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/courses`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter courses by current instructor
        const instructorCourses = currentUser?.role === 'instructor' 
          ? data.filter(course => 
              course.instructor?._id === currentUser.id || 
              course.instructor === currentUser.id ||
              course.instructor?.id === currentUser.id
            )
          : data;
        setCourses(instructorCourses);
      } else {
        showToast('Failed to fetch courses', 'error');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      showToast('Error fetching courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/url/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const showToast = (message, type = 'info') => {
    setToastMessage({ text: message, type });
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleThumbnailUpload = async (file) => {
    if (!file) return;

    try {
      setUploadProgress({ ...uploadProgress, thumbnail: 0 });
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = (prev.thumbnail || 0) + 20;
          if (newProgress >= 80) {
            clearInterval(progressInterval);
          }
          return { ...prev, thumbnail: Math.min(newProgress, 80) };
        });
      }, 200);

      const uploadResult = await uploadFile(file, 'image');
      
      setCourseData({
        ...courseData,
        thumbnail: file,
        thumbnailUrl: uploadResult.url
      });

      setUploadProgress({ ...uploadProgress, thumbnail: 100 });
      showToast('Thumbnail uploaded successfully', 'success');
      
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, thumbnail: undefined }));
      }, 1000);

    } catch (error) {
      showToast('Failed to upload thumbnail', 'error');
      setUploadProgress(prev => ({ ...prev, thumbnail: undefined }));
    }
  };

  const updateLesson = (index, field, value) => {
    const newLessons = [...courseData.lessons];
    newLessons[index][field] = value;
    setCourseData({ ...courseData, lessons: newLessons });
  };

  const handleVideoUpload = async (lessonIndex, file) => {
    if (!file) return;
    
    const progressKey = `lesson_${lessonIndex}`;
    setUploadProgress({ ...uploadProgress, [progressKey]: 0 });
    
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = (prev[progressKey] || 0) + 15;
          if (newProgress >= 80) {
            clearInterval(progressInterval);
          }
          return { ...prev, [progressKey]: Math.min(newProgress, 80) };
        });
      }, 300);

      const uploadResult = await uploadFile(file, 'video');
      
      const newLessons = [...courseData.lessons];
      newLessons[lessonIndex].video = file;
      newLessons[lessonIndex].videoUrl = uploadResult.url;
      newLessons[lessonIndex].bunnyFileId = uploadResult.public_id;
      
      setCourseData({ ...courseData, lessons: newLessons });
      
      setUploadProgress({ ...uploadProgress, [progressKey]: 100 });
      showToast(`Video uploaded successfully for lesson ${lessonIndex + 1}`, 'success');
      
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [progressKey]: undefined }));
      }, 1000);

    } catch (error) {
      showToast(`Failed to upload video for lesson ${lessonIndex + 1}`, 'error');
      setUploadProgress(prev => ({ ...prev, [progressKey]: undefined }));
    }
  };

  const updateQuiz = (field, value, optionIndex = null) => {
    const newQuiz = { ...courseData.quizzes[0] };
    if (field === 'option') {
      newQuiz.options[optionIndex] = value;
    } else {
      newQuiz[field] = value;
    }
    setCourseData({ ...courseData, quizzes: [newQuiz] });
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    populateFormForEdit(course);
    setCurrentView('edit');
  };

  const handleCreate = () => {
    setEditingCourse(null);
    resetFormData();
    setCurrentView('create');
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    resetFormData();
    setCurrentView('dashboard');
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        showToast('Course deleted successfully', 'success');
        await fetchCourses();
      } else {
        showToast('Failed to delete course', 'error');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      showToast('Error deleting course', 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitCourse = async (isEdit = false) => {
    const newErrors = {};
    
    if (!currentUser) {
      showToast('Please log in to manage courses', 'error');
      return;
    }
    
    if (currentUser.role !== 'instructor') {
      showToast('Only instructors can manage courses', 'error');
      return;
    }

    if (!courseData.title.trim()) newErrors.title = 'Title is required';
    if (!courseData.description.trim()) newErrors.description = 'Description is required';
    if (!courseData.category.trim()) newErrors.category = 'Category is required';
    if (!courseData.price || courseData.price < 0) newErrors.price = 'Valid price is required';
    if (!courseData.lessons[0].name.trim()) newErrors.lessons = 'Lesson name is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        
        const coursePayload = {
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          level: courseData.level,
          price: parseFloat(courseData.price),
          duration: parseInt(courseData.duration) || 0,
          instructorId: currentUser.id
        };

        let response;
        let courseId;

        if (isEdit && editingCourse) {
          // Update existing course
          response = await fetch(`${API_BASE}/courses/${editingCourse._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(coursePayload)
          });
          courseId = editingCourse._id;
        } else {
          // Create new course
          response = await fetch(`${API_BASE}/courses`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(coursePayload)
          });
        }

        if (response.ok) {
          const courseResult = await response.json();
          if (!isEdit) {
            courseId = courseResult.course._id;
          }

          // Update thumbnail if changed
          if (courseData.thumbnailUrl && courseData.thumbnail) {
            await fetch(`${API_BASE}/courses/${courseId}/thumbnail`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
              },
              body: JSON.stringify({
                filename: courseData.thumbnail?.name || 'thumbnail.jpg',
                url: courseData.thumbnailUrl,
                bunnyFileId: courseData.thumbnail?.name || 'thumb_' + Date.now()
              })
            });
          }

          // Update video if changed
          const lesson = courseData.lessons[0];
          if (lesson.name.trim() && lesson.videoUrl && lesson.video) {
            await fetch(`${API_BASE}/courses/${courseId}/videos`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
              },
              body: JSON.stringify({
                title: lesson.name,
                filename: lesson.video?.name || 'lesson_1.mp4',
                url: lesson.videoUrl,
                bunnyFileId: lesson.bunnyFileId || 'video_' + Date.now(),
                duration: 0,
                order: 1
              })
            });
          }

          resetFormData();
          setCurrentView('dashboard');
          await fetchCourses();
          showToast(isEdit ? 'Course updated successfully!' : 'Course created successfully!', 'success');
        } else {
          const errorData = await response.json();
          showToast(errorData.message || `Failed to ${isEdit ? 'update' : 'create'} course`, 'error');
        }
      } catch (error) {
        console.error('Error with course:', error);
        showToast(`Error ${isEdit ? 'updating' : 'creating'} course`, 'error');
      } finally {
        setLoading(false);
      }
    } else {
      showToast('Please fix the errors before submitting', 'error');
    }
  };

  // Course Form Component (used for both create and edit)
  const CourseForm = ({ isEdit = false }) => (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Edit Course' : 'Create New Course'}
        </h2>
        <button
          onClick={handleCancelEdit}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
      </div>
      
      {/* User Info Display */}
      {currentUser && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructor:</strong> {currentUser.name} ({currentUser.email})
            {isEdit && editingCourse && (
              <span className="ml-4">
                <strong>Editing:</strong> {editingCourse.title}
              </span>
            )}
          </p>
        </div>
      )}
      
      {/* Basic Course Info */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Course Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleThumbnailUpload(e.target.files[0])}
                className="hidden"
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer">
                {courseData.thumbnailUrl ? (
                  <div className="relative">
                    <img 
                      src={courseData.thumbnailUrl} 
                      alt="Thumbnail preview" 
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                    <span className="text-sm text-gray-500">Upload Thumbnail</span>
                  </>
                )}
              </label>
              {uploadProgress.thumbnail !== undefined && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.thumbnail}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{uploadProgress.thumbnail}% uploaded</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Course Title *</label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter course title"
                autoFocus
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <input
                type="text"
                value={courseData.category}
                onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter course category"
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea
            value={courseData.description}
            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
            className={`w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter course description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Level</label>
            <select
              value={courseData.level}
              onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Price ($) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={courseData.price}
              onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Duration (hours)</label>
            <input
              type="number"
              min="0"
              value={courseData.duration}
              onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Single Lesson Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Lesson</h3>
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium mb-3">Lesson 1</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Lesson Name *</label>
              <input
                type="text"
                value={courseData.lessons[0].name}
                onChange={(e) => updateLesson(0, 'name', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.lessons ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter lesson name"
              />
              {errors.lessons && <p className="text-red-500 text-sm mt-1">{errors.lessons}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Video Upload</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoUpload(0, e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {uploadProgress.lesson_0 !== undefined && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.lesson_0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{uploadProgress.lesson_0}% uploaded</p>
                </div>
              )}
              {courseData.lessons[0].videoUrl && (
                <p className="text-sm text-green-600 mt-1">✓ Video {isEdit ? 'ready' : 'uploaded successfully'}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Lesson Description</label>
            <textarea
              value={courseData.lessons[0].description}
              onChange={(e) => updateLesson(0, 'description', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Enter lesson description"
            />
          </div>
        </div>
      </div>

      {/* Single Quiz Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Quiz</h3>
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium mb-4">Quiz 1</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Question</label>
            <input
              type="text"
              value={courseData.quizzes[0].question}
              onChange={(e) => updateQuiz('question', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter quiz question"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {courseData.quizzes[0].options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <label className="block text-sm font-medium mb-2">
                  Option {optionIndex + 1}
                  <input
                    type="radio"
                    name="correct-answer"
                    checked={courseData.quizzes[0].correctAnswer === optionIndex}
                    onChange={() => updateQuiz('correctAnswer', optionIndex)}
                    className="ml-2"
                  />
                  (Correct)
                </label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateQuiz('option', e.target.value, optionIndex)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder={`Enter option ${optionIndex + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Certificate Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Certificate Title</label>
            <input
              type="text"
              value={courseData.certificate.title}
              onChange={(e) => setCourseData({ 
                ...courseData, 
                certificate: { ...courseData.certificate, title: e.target.value }
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter certificate title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Certificate Subtitle</label>
            <input
              type="text"
              value={courseData.certificate.subtitle}
              onChange={(e) => setCourseData({ 
                ...courseData, 
                certificate: { ...courseData.certificate, subtitle: e.target.value }
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter certificate subtitle"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleCancelEdit}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={() => submitCourse(isEdit)}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save size={16} />
              {isEdit ? 'Update Course' : 'Create Course'}
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Course Card Component with Edit/Delete buttons
  const CourseCard = ({ course, onClick }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {course.thumbnail ? (
          <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <Play size={48} className="text-gray-400" />
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {course.level}
          </span>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {course.category}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <span>{course.videos?.length || 0} videos</span>
          <span className="font-bold text-green-600">${course.price}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onClick(course)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
          >
            View Details
          </button>
          <button
            onClick={() => handleEdit(course)}
            className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 outline-none"
            title="Edit Course"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(course._id)}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 outline-none"
            title="Delete Course"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard Component
  const Dashboard = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
          <p className="text-gray-600 mt-1">Manage your courses - Create, Edit, and Delete</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none"
        >
          <Plus size={20} />
          Create New Course
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <Award size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-4">Create your first course to get started</p>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
          >
            Create Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onClick={setSelectedCourse}
            />
          ))}
        </div>
      )}
    </div>
  );

  // Course Details Modal
  const CourseDetailsModal = ({ course, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{course.title}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  handleEdit(course);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
              >
                <Edit size={16} />
                Edit
              </button>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {course.level}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {course.category}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                ${course.price}
              </span>
            </div>
          </div>
          
          {course.videos && course.videos.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Videos ({course.videos.length})</h3>
              {course.videos.map((video, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 mb-2">
                  <h4 className="font-medium">{video.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Order: {video.order}</span>
                    <a 
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none rounded px-2 py-1"
                    >
                      View Video
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            <p>Course ID: {course.customId || course._id}</p>
            <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>
            {course.instructor && (
              <p>Instructor: {course.instructor.name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
          toastMessage.type === 'success' ? 'bg-green-600' : 
          toastMessage.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {toastMessage.text}
        </div>
      )}
      
      {/* Render appropriate view */}
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'create' && <CourseForm isEdit={false} />}
      {currentView === 'edit' && <CourseForm isEdit={true} />}
      
      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};

export default CourseManagementSystem;
