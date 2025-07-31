
import React, { FC, useEffect } from 'react';
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
    lessons: {
      _id?: string;
      name: string;
      description: string;
      video: File | null;
      videoUrl: string;
      bunnyFileId?: string;
      order?: number;
      chapters: {
        _id?: string;
        title: string;
        startTime: { hours: number; minutes: number; seconds: number };
        endTime: { hours: number; minutes: number; seconds: number };
      }[];
    }[];
    materials: {
      _id?: string;
      title: string;
      filename: string;
      url: string;
      bunnyFileId?: string;
      type: 'pdf' | 'document';
    }[];
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
  handleMaterialUpload: (materialIndex: number, file: File) => Promise<void>;
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
  handleMaterialUpload,
  updateLesson,
  submitCourse,
}) => {
  // Initialize default blank fields for new course
  useEffect(() => {
    if (!isEdit && (!courseData?.lessons?.length || !courseData?.materials?.length)) {
      setCourseData({
        ...courseData,
        lessons: [
          {
            name: '',
            description: '',
            video: null,
            videoUrl: '',
            bunnyFileId: '',
            order: 1,
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
            type: 'document' as 'pdf' | 'document',
          },
        ],
      });
    }
  }, [isEdit, courseData, setCourseData]);

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
      bunnyFileId: '',
      order: (courseData.lessons.length || 0) + 1,
      chapters: [
        {
          title: '',
          startTime: { hours: 0, minutes: 0, seconds: 0 },
          endTime: { hours: 0, minutes: 0, seconds: 0 },
        },
      ],
    };
    
    setCourseData({
      ...courseData,
      lessons: Array.isArray(courseData.lessons) ? [...courseData.lessons, newLesson] : [newLesson],
    });
  };

  // Remove lesson
  const removeLesson = (index: number) => {
    if (Array.isArray(courseData.lessons) && courseData.lessons.length > 1) {
      const updatedLessons = courseData.lessons.filter((_, i) => i !== index);
      setCourseData({
        ...courseData,
        lessons: updatedLessons,
      });
    }
  };

  // Add new chapter to a lesson
  const addChapter = (lessonIndex: number) => {
    if (!Array.isArray(courseData.lessons) || !courseData.lessons[lessonIndex]) return;
    const newChapter = {
      title: '',
      startTime: { hours: 0, minutes: 0, seconds: 0 },
      endTime: { hours: 0, minutes: 0, seconds: 0 },
    };
    
    const updatedLessons = [...courseData.lessons];
    updatedLessons[lessonIndex].chapters = Array.isArray(updatedLessons[lessonIndex].chapters)
      ? [...updatedLessons[lessonIndex].chapters, newChapter]
      : [newChapter];
    
    setCourseData({
      ...courseData,
      lessons: updatedLessons,
    });
  };

  // Update chapter field with overlap validation
  const updateChapter = (lessonIndex: number, chapterIndex: number, field: string, value: any) => {
    if (!Array.isArray(courseData.lessons) || !courseData.lessons[lessonIndex] || !Array.isArray(courseData.lessons[lessonIndex].chapters)) return;
    const updatedLessons = [...courseData.lessons];
    const chapter = { ...updatedLessons[lessonIndex].chapters[chapterIndex] };

    if (field.startsWith('startTime.') || field.startsWith('endTime.')) {
      const [timeField, subField] = field.split('.');
      chapter[timeField] = {
        ...chapter[timeField],
        [subField]: parseInt(value) || 0,
      };
    } else {
      chapter[field] = value;
    }

    // Validate chapter times
    const startSeconds = chapter.startTime.hours * 3600 + chapter.startTime.minutes * 60 + chapter.startTime.seconds;
    const endSeconds = chapter.endTime.hours * 3600 + chapter.endTime.minutes * 60 + chapter.endTime.seconds;
    
    // Check endTime > startTime
    if (endSeconds <= startSeconds) {
      setErrors(prev => ({
        ...prev,
        [`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`]: 'End time must be greater than start time',
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`];
        return newErrors;
      });
    }

    // Check for overlaps with other chapters
    for (let i = 0; i < updatedLessons[lessonIndex].chapters.length; i++) {
      if (i !== chapterIndex) {
        const otherChapter = updatedLessons[lessonIndex].chapters[i];
        const otherStartSeconds = otherChapter.startTime.hours * 3600 + otherChapter.startTime.minutes * 60 + otherChapter.startTime.seconds;
        const otherEndSeconds = otherChapter.endTime.hours * 3600 + otherChapter.endTime.minutes * 60 + otherChapter.endTime.seconds;
        
        if (startSeconds <= otherEndSeconds && endSeconds >= otherStartSeconds) {
          setErrors(prev => ({
            ...prev,
            [`lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`]: `Chapter ${chapter.title || `Chapter ${chapterIndex + 1}`} overlaps with ${otherChapter.title || `Chapter ${i + 1}`}`,
          }));
          return;
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`];
            return newErrors;
          });
        }
      }
    }

    updatedLessons[lessonIndex].chapters[chapterIndex] = chapter;
    setCourseData({
      ...courseData,
      lessons: updatedLessons,
    });
  };

  // Remove chapter
  const removeChapter = (lessonIndex: number, chapterIndex: number) => {
    if (!Array.isArray(courseData.lessons) || !courseData.lessons[lessonIndex] || !Array.isArray(courseData.lessons[lessonIndex].chapters)) return;
    const updatedLessons = [...courseData.lessons];
    updatedLessons[lessonIndex].chapters = updatedLessons[lessonIndex].chapters.filter((_, i) => i !== chapterIndex);
    
    setCourseData({
      ...courseData,
      lessons: updatedLessons,
    });
  };

  // Add new material
  const addMaterial = () => {
    const newMaterial = {
      title: '',
      filename: '',
      url: '',
      bunnyFileId: '',
      type: 'document' as 'pdf' | 'document',
    };
    
    setCourseData({
      ...courseData,
      materials: Array.isArray(courseData.materials) ? [...courseData.materials, newMaterial] : [newMaterial],
    });
  };

  // Update material field
  const updateMaterial = (materialIndex: number, field: string, value: any) => {
    if (!Array.isArray(courseData.materials)) return;
    const updatedMaterials = [...courseData.materials];
    updatedMaterials[materialIndex] = {
      ...updatedMaterials[materialIndex],
      [field]: value,
    };
    
    // Validate material fields
    const material = updatedMaterials[materialIndex];
    const newErrors: { [key: string]: string } = { ...errors };
    
    if (!material.title) {
      newErrors[`material_${materialIndex}_title`] = 'Material title is required';
    } else {
      delete newErrors[`material_${materialIndex}_title`];
    }
    
    if (!material.url && material.type === 'document') {
      newErrors[`material_${materialIndex}_url`] = 'Google Drive link is required';
    } else {
      delete newErrors[`material_${materialIndex}_url`];
    }
    
    if (!['pdf', 'document'].includes(material.type)) {
      newErrors[`material_${materialIndex}_type`] = 'Material type must be pdf or document';
    } else {
      delete newErrors[`material_${materialIndex}_type`];
    }
    
    setErrors(newErrors);
    setCourseData({
      ...courseData,
      materials: updatedMaterials,
    });
  };

  // Remove material
  const removeMaterial = (materialIndex: number) => {
    if (!Array.isArray(courseData.materials)) return;
    const updatedMaterials = courseData.materials.filter((_, i) => i !== materialIndex);
    
    setCourseData({
      ...courseData,
      materials: updatedMaterials,
    });
  };

  // Update submitCourse to include robust validation
  const submitCourseWithValidation = async (isEdit: boolean) => {
    const newErrors: { [key: string]: string } = {};
    
    // Validate course fields
    if (!courseData.title) newErrors.title = 'Course title is required';
    if (!courseData.description) newErrors.description = 'Description is required';
    if (!courseData.category) newErrors.category = 'Category is required';
    if (courseData.price === undefined || courseData.price < 0) newErrors.price = 'Price must be non-negative';
    
    // Validate lessons and chapters
    courseData.lessons.forEach((lesson, lessonIndex) => {
      if (!lesson.name) newErrors[`lesson_${lessonIndex}_name`] = 'Lesson name is required';
      lesson.chapters.forEach((chapter, chapterIndex) => {
        if (!chapter.title) newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_title`] = 'Chapter title is required';
        const startSeconds = chapter.startTime.hours * 3600 + chapter.startTime.minutes * 60 + chapter.startTime.seconds;
        const endSeconds = chapter.endTime.hours * 3600 + chapter.endTime.minutes * 60 + chapter.endTime.seconds;
        if (endSeconds <= startSeconds) {
          newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`] = 'End time must be greater than start time';
        }
        // Check for overlaps
        for (let i = 0; i < lesson.chapters.length; i++) {
          if (i !== chapterIndex) {
            const otherChapter = lesson.chapters[i];
            const otherStartSeconds = otherChapter.startTime.hours * 3600 + otherChapter.startTime.minutes * 60 + otherChapter.startTime.seconds;
            const otherEndSeconds = otherChapter.endTime.hours * 3600 + otherChapter.endTime.minutes * 60 + otherChapter.endTime.seconds;
            if (startSeconds <= otherEndSeconds && endSeconds >= otherStartSeconds) {
              newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`] = `Chapter ${chapter.title || `Chapter ${chapterIndex + 1}`} overlaps with ${otherChapter.title || `Chapter ${i + 1}`}`;
            }
          }
        }
      });
    });
    
    // Validate materials
   // Validate materials
courseData.materials.forEach((material, materialIndex) => {
  // Material title and URL are optional now!
  if (!['pdf', 'document'].includes(material.type)) newErrors[`material_${materialIndex}_type`] = 'Material type must be pdf or document';
});


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level,
        price: courseData.price,
        duration: courseData.duration,
        instructorId: currentUser?.id,
        videos: courseData.lessons.map(lesson => ({
          _id: lesson._id,
          title: lesson.name,
          description: lesson.description,
          filename: lesson.video?.name || '',
          url: lesson.videoUrl,
          bunnyFileId: lesson.bunnyFileId,
          order: lesson.order || 0,
          chapters: lesson.chapters,
        })),
        materials: courseData.materials.map(material => ({
          _id: material._id,
          title: material.title,
          url: material.url,
          filename: material.filename || '',
          bunnyFileId: material.bunnyFileId || '',
          type: material.type || 'document',
        })),
      };

      console.log('Submitting payload:', JSON.stringify(payload, null, 2));

      const url = isEdit ? `http://localhost:5000/api/courses/${editingCourse._id}` : 'http://localhost:5000/api/courses';
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit course');
      }
      
      console.log('Course submitted successfully:', data);
      setErrors({});
    } catch (error) {
      console.error('Submit course error:', error);
      setErrors({ submit: error.message });
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

      {/* Materials Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Materials</h3>
          <button
            type="button"
            onClick={addMaterial}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
          >
            <Plus size={16} className="mr-2" />
            Add Material
          </button>
        </div>
        <div className="space-y-6">
          {Array.isArray(courseData.materials) && courseData.materials.length > 0 ? (
            courseData.materials.map((material, materialIndex) => (
              <div key={materialIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Material {materialIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeMaterial(materialIndex)}
                    className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 outline-none"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Material Title *</label>
                    <input
                      type="text"
                      value={material.title}
                      onChange={(e) => updateMaterial(materialIndex, 'title', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        errors[`material_${materialIndex}_title`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter material title"
                    />
                    {errors[`material_${materialIndex}_title`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`material_${materialIndex}_title`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type *</label>
                    <select
                      value={material.type}
                      onChange={(e) => updateMaterial(materialIndex, 'type', e.target.value as 'pdf' | 'document')}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        errors[`material_${materialIndex}_type`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="document">Google Drive Link</option>
                      <option value="pdf">PDF Upload</option>
                    </select>
                    {errors[`material_${materialIndex}_type`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`material_${materialIndex}_type`]}</p>
                    )}
                  </div>
                  <div>
                    {material.type === 'document' ? (
                      <>
                        <label className="block text-sm font-medium mb-2">Google Drive Link *</label>
                        <input
                          type="text"
                          value={material.url}
                          onChange={(e) => updateMaterial(materialIndex, 'url', e.target.value)}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                            errors[`material_${materialIndex}_url`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter Google Drive link"
                        />
                        {errors[`material_${materialIndex}_url`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`material_${materialIndex}_url`]}</p>
                        )}
                      </>
                    ) : (
                      <>
                        <label className="block text-sm font-medium mb-2">PDF Upload</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => e.target.files && handleMaterialUpload(materialIndex, e.target.files[0])}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        {uploadProgress[`material_${materialIndex}`] !== undefined && (
                          <div className="mt-2">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[`material_${materialIndex}`]}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{uploadProgress[`material_${materialIndex}`]}% uploaded</p>
                          </div>
                        )}
                        {material.url && (
                          <p className="text-sm text-green-600 mt-1">✓ PDF {isEdit ? 'ready' : 'uploaded successfully'}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {material.type === 'pdf' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Filename</label>
                      <input
                        type="text"
                        value={material.filename}
                        onChange={(e) => updateMaterial(materialIndex, 'filename', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter filename"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bunny File ID</label>
                      <input
                        type="text"
                        value={material.bunnyFileId || ''}
                        onChange={(e) => updateMaterial(materialIndex, 'bunnyFileId', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter Bunny File ID"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No materials added yet. Click "Add Material" to get started.</p>
            </div>
          )}
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
          {Array.isArray(courseData.lessons) && courseData.lessons.length > 0 ? (
            courseData.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Lesson {lessonIndex + 1}</h4>
                  {Array.isArray(courseData.lessons) && courseData.lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(lessonIndex)}
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
                      onChange={(e) => updateLesson(lessonIndex, 'name', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        errors[`lesson_${lessonIndex}_name`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter lesson name"
                    />
                    {errors[`lesson_${lessonIndex}_name`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`lesson_${lessonIndex}_name`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Video Upload</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => e.target.files && handleVideoUpload(lessonIndex, e.target.files[0])}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {uploadProgress[`lesson_${lessonIndex}`] !== undefined && (
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[`lesson_${lessonIndex}`]}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{uploadProgress[`lesson_${lessonIndex}`]}% uploaded</p>
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
                    onChange={(e) => updateLesson(lessonIndex, 'description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Enter lesson description"
                  />
                </div>

                {/* Chapters Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold">Chapters</h4>
                    <button
                      type="button"
                      onClick={() => addChapter(lessonIndex)}
                      className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Chapter
                    </button>
                  </div>
                  {Array.isArray(lesson.chapters) && lesson.chapters.length === 0 ? (
                    <p className="text-sm text-gray-500">No chapters added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {Array.isArray(lesson.chapters) &&
                        lesson.chapters.map((chapter, chapterIndex) => (
                          <div key={chapterIndex} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-sm font-medium">Chapter {chapterIndex + 1}</h5>
                              <button
                                type="button"
                                onClick={() => removeChapter(lessonIndex, chapterIndex)}
                                className="flex items-center px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 outline-none"
                              >
                                <Trash2 size={12} className="mr-1" />
                                Remove
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-xs font-medium mb-1">Chapter Title *</label>
                                <input
                                  type="text"
                                  value={chapter.title}
                                  onChange={(e) => updateChapter(lessonIndex, chapterIndex, 'title', e.target.value)}
                                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                                    errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_title`] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="Enter chapter title"
                                />
                                {errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_title`] && (
                                  <p className="text-red-500 text-xs mt-1">{errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_title`]}</p>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-xs font-medium mb-1">Start Time (Hours)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={chapter.startTime.hours}
                                    onChange={(e) => updateChapter(lessonIndex, chapterIndex, 'startTime.hours', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Minutes</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={chapter.startTime.minutes}
                                    onChange={(e) => updateChapter(lessonIndex, chapterIndex, 'startTime.minutes', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Seconds</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={chapter.startTime.seconds}
                                    onChange={(e) => updateChapter(lessonIndex, chapterIndex, 'startTime.seconds', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-xs font-medium mb-1">End Time (Hours)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={chapter.endTime.hours}
                                    onChange={(e) => updateChapter(lessonIndex, chapterIndex, 'endTime.hours', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Minutes</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={chapter.endTime.minutes}
                                    onChange={(e) => updateChapter(lessonIndex, chapterIndex, 'endTime.minutes', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Seconds</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={chapter.endTime.seconds}
                                    onChange={(e) => updateChapter(lessonIndex, chapterIndex, 'endTime.seconds', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center">
                                {errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`] && (
                                  <p className="text-red-500 text-xs mt-1">{errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`]}</p>
                                )}
                                {errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`] && (
                                  <p className="text-red-500 text-xs mt-1">{errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`]}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No lessons added yet. Click "Add New Lesson" to get started.</p>
            </div>
          )}
        </div>
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
          onClick={() => submitCourseWithValidation(isEdit)}
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
      {errors.submit && <p className="text-red-500 text-sm mt-4">{errors.submit}</p>}
    </div>
  );
};

export default CourseForm;
