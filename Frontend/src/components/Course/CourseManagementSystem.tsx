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
    thumbnail: {filename: "", url: "", bunnyFileId:""},
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    duration: 0,
    tags: '',
    isPublished: false,

    lessons: [
      {
        name: '',
        description: '',
        video: null as File | null,
        videoUrl: '',
        bunnyFileId: '',
        duration: 0,
        order: 0,
        chapters: [
          {
            title: '',
            startTime: { hours: 0, minutes: 0, seconds: 0 },
            endTime: { hours: 0, minutes: 0, seconds: 0 },
          },
        ],
      },
    ],

    materials: [
      {
        title: '',
        filename: '',
        url: '',
        bunnyFileId: '',
        type: 'pdf' as 'pdf' | 'image' | 'document',
      },
    ],

    quizzes: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ],

    certificate: {
      title: '',
      subtitle: '',
    },
  });

  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number | undefined }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  interface Course {
    _id: string;
    customId?: string;
    title: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    price: number;
    duration: number;
    tags?: string;
    isPublished: boolean;
    createdAt: string;

    thumbnail?: {
      url: string;
      filename?: string;
      bunnyFileId?: string;
    };

    instructor?: {
      _id: string;
      id?: string;
      name: string;
      email?: string;
      bio?: string;
    };

    videos?: Lesson[]; // alias for lessons
    materials?: Material[];
    quizzes?: Quiz[];
    certificate?: Certificate;
  }

  interface Lesson {
    name: string;
    description: string;
    videoUrl: string;
    video?: File | null;
    bunnyFileId: string;
    duration: number;
    order: number;
    chapters: Chapter[];
  }

  interface Chapter {
    title: string;
    startTime: {
      hours: number;
      minutes: number;
      seconds: number;
    };
    endTime: {
      hours: number;
      minutes: number;
      seconds: number;
    };
  }

  interface Material {
    title: string;
    filename: string;
    url: string;
    bunnyFileId: string;
    type: 'pdf' | 'image' | 'document';
    content?: string; // Only for 'document' type
  }

  interface Quiz {
    question: string;
    options: string[];
    correctAnswer: number;
  }

  interface Certificate {
    title: string;
    subtitle: string;
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
      thumbnail: {filename: course.thumbnail?.filename || "", url: course.thumbnail?.url || "", bunnyFileId: course.thumbnail?.bunnyFileId || ""},
      title: course.title || '',
      description: course.description || '',
      category: course.category || '',
      level: course.level || 'beginner',
      price: course.price || 0,
      duration: course.duration || 0,
      tags: '',

      lessons: course.videos?.length > 0
        ? course.videos.map((video) => ({
            name: video.title || '',
            description: video.description || '',
            video: null, // you can't pre-populate a File input
            videoUrl: video.url || '',
            bunnyFileId: video.bunnyFileId || '',
            duration: video.duration || 0,
            order: video.order || 0,
            chapters: video.chapters?.length > 0
              ? video.chapters.map((chapter) => ({
                  title: chapter.title || '',
                  startTime: {
                    hours: chapter.startTime?.hours ?? 0,
                    minutes: chapter.startTime?.minutes ?? 0,
                    seconds: chapter.startTime?.seconds ?? 0,
                  },
                  endTime: {
                    hours: chapter.endTime?.hours ?? 0,
                    minutes: chapter.endTime?.minutes ?? 0,
                    seconds: chapter.endTime?.seconds ?? 0,
                  },
                }))
              : [],
          }))
        : [{
            name: '',
            description: '',
            video: null,
            videoUrl: '',
            bunnyFileId: '',
            duration: 0,
            order: 0,
            chapters: [],
          }],

      materials: course.materials?.length > 0
        ? course.materials.map((mat) => ({
            title: mat.title || '',
            filename: mat?.filename || '',
            url: mat.url || '',
            bunnyFileId: mat.bunnyFileId || '',
            type: mat.type || 'pdf',
          }))
        : [],

      quizzes: course.quizzes?.length > 0
        ? course.quizzes
        : [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }],

      certificate: course.certificate || { title: '', subtitle: '' },

      isPublished: course.isPublished ?? false,
    });
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/courses/instructor/myCourses`, {
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

  const uploadFile = async (file: File, type: 'image' | 'video' | 'material' = 'image') => {
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
      const thumbnailData = { filename: file.name, url: uploadResult.data?.url, bunnyFileId: uploadResult.data.public_id || `thumb_${Date.now()}`}
      setCourseData({ ...courseData, thumbnail:thumbnailData });
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

  const handleMaterialUpload = async (materialIndex: number, file: File) => {
    if (!file) return;
    const progressKey = `material_${materialIndex}`;
    try {
      setUploadProgress({ ...uploadProgress, [progressKey]: 0 });
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = (prev[progressKey] || 0) + 15;
          if (newProgress >= 80) clearInterval(progressInterval);
          return { ...prev, [progressKey]: Math.min(newProgress, 80) };
        });
      }, 300);
      const uploadResult = await uploadFile(file, 'material');
      const newMaterials = [...courseData.materials];
      newMaterials[materialIndex] = {
        ...newMaterials[materialIndex],
        filename: file.name,
        url: uploadResult.data.url,
        bunnyFileId: uploadResult.data.public_id || `material_${Date.now()}`,
        type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'document',
        title: newMaterials[materialIndex].title || file.name.split('.')[0]
      };
      setCourseData({ ...courseData, materials: newMaterials });
      setUploadProgress({ ...uploadProgress, [progressKey]: 100 });
      showToast(`Material uploaded successfully for material ${materialIndex + 1}`, 'success');
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [progressKey]: undefined }));
      }, 1000);
    } catch (error) {
      showToast(`Failed to upload material for material ${materialIndex + 1}`, 'error');
      setUploadProgress((prev) => ({ ...prev, [progressKey]: undefined }));
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

  const submitCourse = async (isEdit: boolean, courseData) => {
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
  if (!courseData.lessons[0]?.name?.trim()) newErrors.lessons = 'At least one lesson is required';

  // Validate materials
  courseData.materials?.forEach((material, materialIndex) => {
    if (!['pdf', 'document'].includes(material.type)) {
      newErrors[`material_${materialIndex}_type`] = 'Material type must be pdf or document';
    }
  });

  // Validate chapters (optional)
  courseData.lessons?.forEach((lesson, lessonIndex) => {
    lesson.chapters?.forEach((chapter, chapterIndex) => {
      const startSeconds = chapter.startTime.hours * 3600 + chapter.startTime.minutes * 60 + chapter.startTime.seconds;
      const endSeconds = chapter.endTime.hours * 3600 + chapter.endTime.minutes * 60 + chapter.endTime.seconds;
      if (endSeconds <= startSeconds) {
        newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`] = 'End time must be greater than start time';
      }

      // Check overlaps
      for (let i = 0; i < lesson.chapters.length; i++) {
        if (i !== chapterIndex) {
          const other = lesson.chapters[i];
          const otherStart = other.startTime.hours * 3600 + other.startTime.minutes * 60 + other.startTime.seconds;
          const otherEnd = other.endTime.hours * 3600 + other.endTime.minutes * 60 + other.endTime.seconds;
          if (startSeconds <= otherEnd && endSeconds >= otherStart) {
            newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`] =
              `Chapter "${chapter.title || `Chapter ${chapterIndex + 1}`}" overlaps with "${other.title || `Chapter ${i + 1}`}"`;
          }
        }
      }
    }); 
  });

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) {
    console.log(newErrors);
    showToast('Please fix the errors before submitting', 'error');
    return;
  }

  try {
    setLoading(true);

    // Base payload
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

    // Create or update course
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
      const courseResult = await response.json();
      courseId = courseResult.course._id;
    }

    if (!response.ok) {
      const errorData = await response.json();
      showToast(errorData.message || 'Course submission failed', 'error');
      return;
    }

    // Upload thumbnail
    if (courseData.thumbnail) {
      await fetch(`${API_BASE}/courses/${courseId}/thumbnail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(courseData.thumbnail),
      });
    }

    // Upload lessons/videos
    for (let i = 0; i < courseData.lessons.length; i++) {
      const lesson = courseData.lessons[i];
      if (lesson.name.trim() && lesson.videoUrl && lesson.video) {
        const res = await fetch(`${API_BASE}/courses/${courseId}/videos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            title: lesson.name,
            description: lesson.description,
            filename: lesson.video?.name || `lesson_${i + 1}.mp4`,
            url: lesson.videoUrl,
            bunnyFileId: lesson.bunnyFileId || `video_${Date.now()}_${i}`,
            duration: 0,
            order: lesson.order || i + 1,
            chapters: lesson.chapters || [],
          }),
        });
      }
    }

    // Upload materials
    console.log("materials:")
    console.log(courseData);
    for (let i = 0; i < (courseData.materials || []).length; i++) {
      const material = courseData.materials[i];
      await fetch(`${API_BASE}/courses/${courseId}/materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          title: material.title,
          url: material.url,
          filename: material.filename || '',
          bunnyFileId: material.bunnyFileId || '',
          type: material.type || 'document',
        }),
      });
    }

    resetFormData();
    setCurrentView('dashboard');
    await fetchCourses();
    showToast(isEdit ? 'Course updated successfully!' : 'Course created successfully!', 'success');
  } catch (error) {
    console.error('Course submit error:', error);
    showToast('An error occurred while submitting the course', 'error');
  } finally {
    setLoading(false);
    // window.location.href = "/course-management"
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
          handleMaterialUpload={handleMaterialUpload}
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