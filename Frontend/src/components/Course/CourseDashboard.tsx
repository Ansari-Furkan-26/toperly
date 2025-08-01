import React, { FC, useState, useEffect, useCallback, useRef } from "react";
import {
  Plus,
  Play,
  Award,
  Edit,
  Trash2,
  X,
  BookOpen,
  Users,
  Clock,
  Calendar,
  Brain,
  PlusCircle,
  FileText,
  Link,
} from "lucide-react";
import QuizForm from "./QuizForm";

interface Course {
  _id: string;
  customId?: string;
  title: string;
  description: string;
  level: string;
  category: string;
  price: number;
  duration?: number;
  tags?: string;
  videos?: {
    _id?: string;
    title: string;
    url: string;
    order: number;
    description?: string;
    bunnyFileId?: string;
    chapters: {
      _id?: string;
      title: string;
      startTime: { hours: number; minutes: number; seconds: number };
      endTime: { hours: number; minutes: number; seconds: number };
    }[];
  }[];
  lessons?: {
    name: string;
    description: string;
    videoUrl: string;
    chapters: {
      _id?: string;
      title: string;
      startTime: { hours: number; minutes: number; seconds: number };
      endTime: { hours: number; minutes: number; seconds: number };
    }[];
  }[];
  thumbnail?: { url: string };
  instructor?: { _id: string; id?: string; name: string };
  createdAt: string;
  updatedAt?: string;
  materials: {
    title: string;
    filename: string;
    url: string;
    bunnyFileId?: string;
    type: "pdf" | "document";
  }[];
}

interface Quiz {
  _id: string;
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  course: string;
  lesson?: string;
  createdAt: string;
}

interface CourseDashboardProps {
  courses: Course[];
  loading: boolean;
  handleCreate: () => void;
  handleEdit: (course: Course) => void;
  handleDelete: (courseId: string) => Promise<void>;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  selectedCourse: Course | null;
}

const CourseDashboard: FC<CourseDashboardProps> = ({
  courses = [],
  loading,
  handleCreate,
  handleEdit,
  handleDelete,
  setSelectedCourse,
  selectedCourse,
}) => {
  const [courseQuizzes, setCourseQuizzes] = useState<Quiz[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);
  const quizCache = useRef<Map<string, Quiz[]>>(new Map());
  const currentRequestRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const API_BASE_URL = "http://localhost:5000";

  const fetchCourseQuizzes = useCallback(
    async (courseId: string, forceRefresh = false) => {
      if (currentRequestRef.current === courseId && !forceRefresh) {
        console.log("Preventing duplicate request for course:", courseId);
        return;
      }

      if (quizCache.current.has(courseId) && !forceRefresh) {
        console.log("Using cached data for course:", courseId);
        setCourseQuizzes(quizCache.current.get(courseId) || []);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      console.log("Making API request for course:", courseId);

      currentRequestRef.current = courseId;
      abortControllerRef.current = new AbortController();
      setQuizLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/quizzes?course=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: abortControllerRef.current.signal,
          }
        );

        if (response.ok) {
          const data = await response.json();
          const quizzes = data.data || [];

          quizCache.current.set(courseId, quizzes);
          setCourseQuizzes(quizzes);
          console.log(
            "Quiz data cached for course:",
            courseId,
            "Count:",
            quizzes.length
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching quizzes:", error);
        }
      } finally {
        setQuizLoading(false);
        currentRequestRef.current = null;
        abortControllerRef.current = null;
      }
    },
    [API_BASE_URL]
  );

  useEffect(() => {
    if (selectedCourse?._id) {
      fetchCourseQuizzes(selectedCourse._id);
    } else {
      setCourseQuizzes([]);
      currentRequestRef.current = null;
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedCourse?._id, fetchCourseQuizzes]);

  const handleDeleteQuiz = useCallback(
    async (quizId: string) => {
      if (!selectedCourse?._id) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const updatedQuizzes = courseQuizzes.filter(
            (quiz) => quiz._id !== quizId
          );
          quizCache.current.set(selectedCourse._id, updatedQuizzes);
          setCourseQuizzes(updatedQuizzes);
          console.log("Quiz deleted and cache updated");
        }
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    },
    [selectedCourse?._id, courseQuizzes, API_BASE_URL]
  );
  
  const handleDeleteMaterial = useCallback(async (courseId: string, materialId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/materials/${materialId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const updatedMaterials = selectedCourse?.materials.filter((m, idx) => {
        const currentMaterialId = m.bunnyFileId || idx.toString();
        return currentMaterialId !== materialId;
      });

      if (selectedCourse && updatedMaterials) {
        setSelectedCourse({
          ...selectedCourse,
          materials: updatedMaterials,
        });
      }

      console.log('Material deleted successfully');
    } else {
      console.error('Failed to delete material:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting material:', error);
  }
}, [API_BASE_URL, selectedCourse, setSelectedCourse]);


  const handleQuizSuccess = useCallback(() => {
    if (selectedCourse?._id) {
      quizCache.current.delete(selectedCourse._id);
      fetchCourseQuizzes(selectedCourse._id, true);
      console.log("Quiz created, cache invalidated and refreshed");
    }
  }, [selectedCourse?._id, fetchCourseQuizzes]);

  const CourseCard = ({
    course,
    onClick,
  }: {
    course: Course;
    onClick: (course: Course) => void;
  }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {course.thumbnail ? (
          <img
            src={course.thumbnail.url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Play size={48} className="text-gray-400" />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {course.level}
          </span>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {course.category}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <span>
            {course.lessons?.length || course.videos?.length || 0} lessons
          </span>
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
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(course._id);
            }}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 outline-none"
            title="Delete Course"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const CourseDetailsModal = ({
    course,
    onClose,
  }: {
    course: Course;
    onClose: () => void;
  }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">{course.title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onClose();
                    handleEdit(course);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 outline-none"
                >
                  <Edit size={16} />
                  Edit Course
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Course Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BookOpen className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Level</p>
                    <p className="font-semibold capitalize">{course.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Clock className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">
                      {course.duration || "N/A"} hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lessons</p>
                    <p className="font-semibold">
                      {course.lessons?.length || course.videos?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Award className="text-yellow-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold text-green-600">
                      ${course.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {course.tags && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials */}
                {course.materials && course.materials.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">
                      Materials ({course.materials.length})
                    </h3>
                    <div className="space-y-3">
                      {course.materials.map((material, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-lg mb-2">
                                {material.title}
                              </h4>
                              <p className="text-gray-500 text-xs">
                                {material.filename || "No file uploaded"}
                              </p>
                            </div>
                            <div className="flex gap-2 items-center">
                              <a
                                href={material.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                              >
                                {material.type === "pdf" ? (
                                  <FileText size={14} />
                                ) : (
                                  <Link size={14} />
                                )}
                                Open
                              </a>
                              <button
                                onClick={() =>
                                  handleDeleteMaterial(
                                    course._id,
                                    material.bunnyFileId || index.toString()
                                  )
                                }
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors text-sm"
                                title="Delete Material"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lessons */}
                {course.lessons && course.lessons.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">
                      Lessons ({course.lessons.length})
                    </h3>
                    <div className="space-y-3">
                      {course.lessons.map((lesson, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-lg mb-2">
                                {index + 1}. {lesson.name}
                              </h4>
                              {lesson.description && (
                                <p className="text-gray-600 text-sm mb-3">
                                  {lesson.description}
                                </p>
                              )}
                              {lesson.chapters &&
                                lesson.chapters.length > 0 && (
                                  <div className="mt-2">
                                    <h5 className="text-sm font-semibold mb-2">
                                      Chapters ({lesson.chapters.length})
                                    </h5>
                                    <ul className="list-disc pl-5 text-sm text-gray-600">
                                      {lesson.chapters.map(
                                        (chapter, chapterIndex) => (
                                          <li
                                            key={chapterIndex}
                                            className="mb-1"
                                          >
                                            {chapter.title} (
                                            {chapter.startTime.hours}h{" "}
                                            {chapter.startTime.minutes}m{" "}
                                            {chapter.startTime.seconds}s -{" "}
                                            {chapter.endTime.hours}h{" "}
                                            {chapter.endTime.minutes}m{" "}
                                            {chapter.endTime.seconds}s)
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                            </div>
                            {lesson.videoUrl && (
                              <a
                                href={lesson.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                              >
                                <Play size={14} />
                                Watch
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quizzes Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                      Quizzes ({courseQuizzes.length})
                    </h3>
                    <button
                      onClick={() => setShowAddQuiz(true)}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <PlusCircle size={16} />
                      Add Quiz
                    </button>
                  </div>

                  {quizLoading ? (
                    <div className="text-center py-8">
                      <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading quizzes...</p>
                    </div>
                  ) : courseQuizzes.length > 0 ? (
                    <div className="space-y-3">
                      {courseQuizzes.map((quiz) => (
                        <div
                          key={quiz._id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-lg mb-2">
                                {quiz.title}
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {quiz.questions.length} question
                                {quiz.questions.length !== 1 ? "s" : ""}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">
                                Created:{" "}
                                {new Date(quiz.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                                onClick={() => setEditQuiz(quiz)}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteQuiz(quiz._id)}
                                className="text-red-600 hover:text-red-800 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Brain size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">
                        No quizzes created yet
                      </p>
                      <button
                        onClick={() => setShowAddQuiz(true)}
                        className="text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Create your first quiz
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Course Thumbnail */}
                {course.thumbnail && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Course Thumbnail
                    </h3>
                    <img
                      src={course.thumbnail.url}
                      alt={course.title}
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                )}

                {/* Course Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Course Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{course.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course ID:</span>
                      <span className="font-mono text-xs">
                        {course.customId || course._id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>
                        {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {course.updatedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Updated:</span>
                        <span>
                          {new Date(course.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {course.instructor && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Instructor:</span>
                        <span className="font-medium">
                          {course.instructor.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Form Modal */}
          {(showAddQuiz || editQuiz) && (
            <QuizForm
              courseId={course._id}
              courseName={course.title}
              lessons={course.lessons || []}
              isOpen={showAddQuiz || !!editQuiz}
              onClose={() => {
                setShowAddQuiz(false);
                setEditQuiz(null);
              }}
              onSuccess={handleQuizSuccess}
              quiz={editQuiz}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Course Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your courses - Create, Edit, and Delete
          </p>
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
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No courses yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first course to get started
          </p>
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

      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          onClose={() => {
            setSelectedCourse(null);
            setShowAddQuiz(false);
          }}
        />
      )}
    </div>
  );
};

export default CourseDashboard;
