import React, { FC, useState, useEffect } from 'react';
import CourseDashboard from './CourseDashboard';
import CourseForm from './CourseForm';

const CourseManagementSystem: FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'edit'>('dashboard');
  const [courses, setCourses] = useState<Course[]>([]); // Ensure initial state is an empty array
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [courseData, setCourseData] = useState({
    thumbnail: null as File | null,
    thumbnailUrl: '',
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    duration: 0,
    tags: '',
    lessons: [{ name: '', description: '', video: null as File | null, videoUrl: '', bunnyFileId: '' }],
    quizzes: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }],
    certificate: { title: '', subtitle: '' },
  });
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number | undefined }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  interface Course {
    _id: string;
    customId?: string;
    title: string;
    description: string;
    level: string;
    category: string;
    price: number;
    videos?: { title: string; url: string; order: number }[];
    thumbnail?: { url: string };
    instructor?: { _id: string; id?: string; name: string };
    createdAt: string;
  }

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
      lessons: [{ name: '', description: '', video: null, videoUrl: '', bunnyFileId: '' }],
      quizzes: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }],
      certificate: { title: '', subtitle: '' },
    });
    setErrors({});
    setUploadProgress({});
  };

  const populateFormForEdit = (course: Course) => {
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
        bunnyFileId: course.videos[0].bunnyFileId || '',
      }] : [{ name: '', description: '', video: null, videoUrl: '', bunnyFileId: '' }],
      quizzes: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }],
      certificate: { title: '', subtitle: '' },
    });
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/courses`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (response.ok) {
        const data = await response.json();
        const instructorCourses = currentUser?.role === 'instructor'
          ? data.filter((course: Course) =>
              course.instructor?._id === currentUser.id ||
              course.instructor?.id === currentUser.id
            )
          : data;
        setCourses(instructorCourses || []); // Ensure courses is always an array
        console.log('Fetched courses:', instructorCourses);
      } else {
        showToast('Failed to fetch courses', 'error');
        setCourses([]); // Set to empty array on failure
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      showToast('Error fetching courses', 'error');
      setCourses([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, type: 'image' | 'video' = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${API_BASE}/url/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: formData,
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text: message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!file) return;
    try {
      setUploadProgress({ ...uploadProgress, thumbnail: 0 });
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = (prev.thumbnail || 0) + 20;
          if (newProgress >= 80) clearInterval(progressInterval);
          return { ...prev, thumbnail: Math.min(newProgress, 80) };
        });
      }, 200);
      const uploadResult = await uploadFile(file, 'image');
      setCourseData({ ...courseData, thumbnail: file, thumbnailUrl: uploadResult.data.url });
      setUploadProgress({ ...uploadProgress, thumbnail: 100 });
      showToast('Thumbnail uploaded successfully', 'success');
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, thumbnail: undefined }));
      }, 1000);
    } catch (error) {
      showToast('Failed to upload thumbnail', 'error');
      setUploadProgress((prev) => ({ ...prev, thumbnail: undefined }));
    }
  };

  const handleVideoUpload = async (lessonIndex: number, file: File) => {
    if (!file) return;
    const progressKey = `lesson_${lessonIndex}`;
    setUploadProgress({ ...uploadProgress, [progressKey]: 0 });
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = (prev[progressKey] || 0) + 15;
          if (newProgress >= 80) clearInterval(progressInterval);
          return { ...prev, [progressKey]: Math.min(newProgress, 80) };
        });
      }, 300);
      const uploadResult = await uploadFile(file, 'video');
      const newLessons = [...courseData.lessons];
      newLessons[lessonIndex] = {
        ...newLessons[lessonIndex],
        video: file,
        videoUrl: uploadResult.data.url,
        bunnyFileId: uploadResult.data.public_id || `video_${Date.now()}`,
      };
      setCourseData({ ...courseData, lessons: newLessons });
      setUploadProgress({ ...uploadProgress, [progressKey]: 100 });
      showToast(`Video uploaded successfully for lesson ${lessonIndex + 1}`, 'success');
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [progressKey]: undefined }));
      }, 1000);
    } catch (error) {
      showToast(`Failed to upload video for lesson ${lessonIndex + 1}`, 'error');
      setUploadProgress((prev) => ({ ...prev, [progressKey]: undefined }));
    }
  };

  const updateLesson = (index: number, field: string, value: any) => {
    const newLessons = [...courseData.lessons];
    newLessons[index][field] = value;
    setCourseData({ ...courseData, lessons: newLessons });
  };

  const updateQuiz = (field: string, value: any, optionIndex: number | null = null) => {
    const newQuiz = { ...courseData.quizzes[0] };
    if (field === 'option' && optionIndex !== null) {
      newQuiz.options[optionIndex] = value;
    } else {
      newQuiz[field] = value;
    }
    setCourseData({ ...courseData, quizzes: [newQuiz] });
  };

  const handleEdit = (course: Course) => {
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

  const handleDelete = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
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

  const submitCourse = async (isEdit: boolean) => {
    const newErrors: { [key: string]: string } = {};
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
          price: parseFloat(courseData.price.toString()),
          duration: parseInt(courseData.duration.toString()) || 0,
          instructorId: currentUser.id,
        };
        let response;
        let courseId: string;
        if (isEdit && editingCourse) {
          response = await fetch(`${API_BASE}/courses/${editingCourse._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(coursePayload),
          });
          courseId = editingCourse._id;
        } else {
          response = await fetch(`${API_BASE}/courses`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(coursePayload),
          });
        }
        if (response.ok) {
          const courseResult = await response.json();
          if (!isEdit) courseId = courseResult.course._id;
          if (courseData.thumbnailUrl && courseData.thumbnail) {
            await fetch(`${API_BASE}/courses/${courseId}/thumbnail`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAuthToken()}`,
              },
              body: JSON.stringify({
                filename: courseData.thumbnail?.name || 'thumbnail.jpg',
                url: courseData.thumbnailUrl,
                bunnyFileId: courseData.thumbnail?.name || `thumb_${Date.now()}`,
              }),
            });
          }
          for (let i = 0; i < courseData.lessons.length; i++) {
        const lesson = courseData.lessons[i];
        
        if (lesson.name.trim() && lesson.videoUrl && lesson.video) {
          await fetch(`${API_BASE}/courses/${courseId}/videos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({
              title: lesson.name,
              filename: lesson.video?.name || `lesson_${i + 1}.mp4`,
              url: lesson.videoUrl,
              bunnyFileId: lesson.bunnyFileId || `video_${Date.now()}_${i}`,
              duration: 0,
              order: i + 1, // Set proper order
            }),
          });
        }
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

  console.log('Rendering CourseManagementSystem, courses:', courses);

  return (
    <div className="min-h-screen bg-gray-50">
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
            toastMessage.type === 'success' ? 'bg-green-600' : toastMessage.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
          }`}
        >
          {toastMessage.text}
        </div>
      )}
      {currentView === 'dashboard' && (
        <CourseDashboard
          courses={courses || []} // Ensure courses is always an array
          loading={loading}
          handleCreate={handleCreate}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setSelectedCourse={setSelectedCourse}
          selectedCourse={selectedCourse}
        />
      )}
      {(currentView === 'create' || currentView === 'edit') && (
        <CourseForm
          isEdit={currentView === 'edit'}
          courseData={courseData}
          errors={errors}
          uploadProgress={uploadProgress}
          loading={loading}
          currentUser={currentUser}
          editingCourse={editingCourse}
          setCourseData={setCourseData}
          setErrors={setErrors}
          setUploadProgress={setUploadProgress}
          handleCancelEdit={handleCancelEdit}
          handleThumbnailUpload={handleThumbnailUpload}
          handleVideoUpload={handleVideoUpload}
          updateLesson={updateLesson}
          updateQuiz={updateQuiz}
          submitCourse={submitCourse}
        />
      )}
    </div>
  );
};

export default CourseManagementSystem;