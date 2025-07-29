import React, { FC } from 'react';
import { ArrowLeft, Upload, Save, Plus, Trash2 } from 'lucide-react';

interface CourseFormProps {
  isEdit: boolean;
  loading: boolean;
  courseData: {
    thumbnail: File | null;
    thumbnailUrl: string;
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    duration: number;
    tags: string;
    lessons: { name: string; description: string; video: File | null; videoUrl: string; bunnyFileId?: string }[];
  };
  errors: { [key: string]: string };
  uploadProgress: { [key: string]: number | undefined };
  currentUser: { id: string; name: string; email: string; role: string } | null;
  editingCourse: any;
  setCourseData: React.Dispatch<React.SetStateAction<any>>;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  setUploadProgress: React.Dispatch<React.SetStateAction<any>>;
  handleCancelEdit: () => void;
  handleThumbnailUpload: (file: File) => Promise<void>;
  handleVideoUpload: (lessonIndex: number, file: File) => Promise<void>;
  updateLesson: (index: number, field: string, value: any) => void;
  submitCourse: (isEdit: boolean) => Promise<void>;
}

const CourseForm: FC<CourseFormProps> = ({
  isEdit,
  loading,
  courseData,
  errors,
  uploadProgress,
  currentUser,
  editingCourse,
  setCourseData,
  setErrors,
  setUploadProgress,
  handleCancelEdit,
  handleThumbnailUpload,
  handleVideoUpload,
  updateLesson,
  submitCourse,
}) => {
  // Guard clause for undefined courseData
  if (!courseData) {
    console.error('CourseForm received undefined courseData');
    return <div>Error: Course data not initialized</div>;
  }

  // Add new lesson
  const addLesson = () => {
    const newLesson = {
      name: '',
      description: '',
      video: null,
      videoUrl: '',
      bunnyFileId: ''
    };
    
    setCourseData({
      ...courseData,
      lessons: [...courseData.lessons, newLesson]
    });
  };

  // Remove lesson
  const removeLesson = (index: number) => {
    if (courseData.lessons.length > 1) {
      const updatedLessons = courseData.lessons.filter((_, i) => i !== index);
      setCourseData({
        ...courseData,
        lessons: updatedLessons
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Course' : 'Create New Course'}</h2>
        <button
          onClick={handleCancelEdit}
          className="flex items-center text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
      </div>

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

      {/* Course Information Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Course Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleThumbnailUpload(e.target.files[0])}
                className="hidden"
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer">
                {courseData.thumbnailUrl ? (
                  <div className="relative">
                    <img src={courseData.thumbnailUrl} alt="Thumbnail preview" className="w-full h-32 object-cover rounded mb-2" />
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
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
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
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
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
            className={`w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
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
              onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
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
              onChange={(e) => setCourseData({ ...courseData, duration: parseInt(e.target.value) || 0 })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              value={courseData.tags}
              onChange={(e) => setCourseData({ ...courseData, tags: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter tags (comma separated)"
            />
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Lessons</h3>
          <button
            type="button"
            onClick={addLesson}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
          >
            <Plus size={16} className="mr-2" />
            Add New Lesson
          </button>
        </div>

        <div className="space-y-6">
          {courseData.lessons.map((lesson, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Lesson {index + 1}</h4>
                {courseData.lessons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 outline-none"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Lesson Name *</label>
                  <input
                    type="text"
                    value={lesson.name}
                    onChange={(e) => updateLesson(index, 'name', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      errors[`lesson_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter lesson name"
                  />
                  {errors[`lesson_${index}_name`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`lesson_${index}_name`]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Video Upload</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files && handleVideoUpload(index, e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {uploadProgress[`lesson_${index}`] !== undefined && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress[`lesson_${index}`]}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{uploadProgress[`lesson_${index}`]}% uploaded</p>
                    </div>
                  )}
                  {lesson.videoUrl && (
                    <p className="text-sm text-green-600 mt-1">✓ Video {isEdit ? 'ready' : 'uploaded successfully'}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Lesson Description</label>
                <textarea
                  value={lesson.description}
                  onChange={(e) => updateLesson(index, 'description', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Enter lesson description"
                />
              </div>
            </div>
          ))}
        </div>

        {courseData.lessons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No lessons added yet. Click "Add New Lesson" to get started.</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
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
};

export default CourseForm;
