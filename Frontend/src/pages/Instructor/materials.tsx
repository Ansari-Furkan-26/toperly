import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, FileText, Video, Link, Image, Trash2, Edit, MoreVertical } from 'lucide-react';

type Material = {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'image';
  url: string;
  createdAt: string;
};

type Lesson = {
  id: string;
  title: string;
  materials: Material[];
  isOpen?: boolean;
};

type Course = {
  id: string;
  title: string;
  lessons: Lesson[];
  isOpen?: boolean;
};

const CoursesMaterialsManager = () => {
  // Sample data - in a real app this would come from an API
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Introduction to React',
      lessons: [
        {
          id: '1-1',
          title: 'React Fundamentals',
          materials: [
            { id: '1-1-1', title: 'React Docs', type: 'link', url: 'https://react.dev', createdAt: '2023-05-10' },
            { id: '1-1-2', title: 'Getting Started PDF', type: 'document', url: '/docs/getting-started.pdf', createdAt: '2023-05-12' },
          ],
        },
        {
          id: '1-2',
          title: 'Components & Props',
          materials: [],
        },
      ],
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      lessons: [
        {
          id: '2-1',
          title: 'Closures',
          materials: [
            { id: '2-1-1', title: 'Closures Explained', type: 'video', url: '/videos/closures.mp4', createdAt: '2023-04-15' },
          ],
        },
      ],
    },
  ]);

  const [newMaterial, setNewMaterial] = useState({
    lessonId: '',
    title: '',
    type: 'document' as const,
    url: '',
  });

  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const toggleCourse = (courseId: string) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, isOpen: !course.isOpen } 
        : course
    ));
  };

  const toggleLesson = (courseId: string, lessonId: string) => {
    setCourses(courses.map(course => {
      if (course.id !== courseId) return course;
      
      return {
        ...course,
        lessons: course.lessons.map(lesson => 
          lesson.id === lessonId 
            ? { ...lesson, isOpen: !lesson.isOpen } 
            : lesson
        ),
      };
    }));
  };

  const handleAddMaterial = (lessonId: string) => {
    setNewMaterial({
      lessonId,
      title: '',
      type: 'document',
      url: '',
    });
    setShowMaterialForm(true);
    setEditingMaterial(null);
  };

  const handleEditMaterial = (material: Material, lessonId: string) => {
    setEditingMaterial(material);
    setNewMaterial({
      lessonId,
      title: material.title,
      type: material.type,
      url: material.url,
    });
    setShowMaterialForm(true);
  };

  const submitMaterial = () => {
    if (!newMaterial.title || !newMaterial.url) return;

    setCourses(courses.map(course => {
      return {
        ...course,
        lessons: course.lessons.map(lesson => {
          if (lesson.id !== newMaterial.lessonId) return lesson;

          const updatedMaterials = editingMaterial
            ? lesson.materials.map(m => 
                m.id === editingMaterial.id 
                  ? { ...m, ...newMaterial, id: m.id } 
                  : m
              )
            : [...lesson.materials, { 
                ...newMaterial, 
                id: `${lesson.id}-${lesson.materials.length + 1}`, 
                createdAt: new Date().toISOString() 
              }];

          return {
            ...lesson,
            materials: updatedMaterials,
          };
        }),
      };
    }));

    setShowMaterialForm(false);
    setNewMaterial({ lessonId: '', title: '', type: 'document', url: '' });
    setEditingMaterial(null);
  };

  const deleteMaterial = (courseId: string, lessonId: string, materialId: string) => {
    setCourses(courses.map(course => {
      if (course.id !== courseId) return course;
      
      return {
        ...course,
        lessons: course.lessons.map(lesson => {
          if (lesson.id !== lessonId) return lesson;
          
          return {
            ...lesson,
            materials: lesson.materials.filter(m => m.id !== materialId),
          };
        }),
      };
    }));
  };

  const getIconForType = (type: Material['type']) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'link': return <Link className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className='bg-gray-100 p-4 md:p-6'>
    <div className=" max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Course Materials Management</h1>
      
      {/* Courses Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {courses.map(course => (
          <div key={course.id} className="border-b dark:border-gray-700">
            {/* Course Header */}
            <div 
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => toggleCourse(course.id)}
            >
              <div className="flex items-center">
                {course.isOpen ? (
                  <ChevronDown className="w-5 h-5 mr-2 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 mr-2 text-gray-500" />
                )}
                <h2 className="font-semibold text-lg">{course.title}</h2>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({course.lessons.length} lessons)
                </span>
              </div>
            </div>

            {/* Lessons List */}
            {course.isOpen && (
              <div className="ml-8">
                {course.lessons.map(lesson => (
                  <div key={lesson.id} className="border-t dark:border-gray-700">
                    {/* Lesson Header */}
                    <div 
                      className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => toggleLesson(course.id, lesson.id)}
                    >
                      <div className="flex items-center">
                        {lesson.isOpen ? (
                          <ChevronDown className="w-4 h-4 mr-2 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-2 text-gray-500" />
                        )}
                        <h3 className="font-medium">{lesson.title}</h3>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          ({lesson.materials.length} materials)
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddMaterial(lesson.id);
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        title="Add material"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Materials List */}
                    {lesson.isOpen && (
                      <div className="ml-6">
                        {lesson.materials.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
                            No materials added yet.
                          </div>
                        ) : (
                          <table className="w-full">
                            <tbody>
                              {lesson.materials.map(material => (
                                <tr key={material.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="p-3">
                                    <div className="flex items-center">
                                      {getIconForType(material.type)}
                                      <span className="ml-2">{material.title}</span>
                                    </div>
                                  </td>
                                  <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                                    {material.type}
                                  </td>
                                  <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(material.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="p-3 text-right">
                                    <div className="flex justify-end space-x-2">
                                      <button
                                        onClick={() => handleEditMaterial(material, lesson.id)}
                                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                        title="Edit"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => deleteMaterial(course.id, lesson.id, material.id)}
                                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Material Modal */}
      {showMaterialForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingMaterial ? 'Edit Material' : 'Add New Material'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Material title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newMaterial.type}
                  onChange={(e) => setNewMaterial({...newMaterial, type: e.target.value as Material['type']})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="document">Document</option>
                  <option value="video">Video</option>
                  <option value="link">Link</option>
                  <option value="image">Image</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {newMaterial.type === 'link' ? 'URL' : 
                   newMaterial.type === 'video' ? 'Video URL' : 
                   newMaterial.type === 'image' ? 'Image URL' : 'File Path'}
                </label>
                <input
                  type="text"
                  value={newMaterial.url}
                  onChange={(e) => setNewMaterial({...newMaterial, url: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder={
                    newMaterial.type === 'link' ? 'https://example.com' : 
                    newMaterial.type === 'video' ? '/videos/filename.mp4' : 
                    newMaterial.type === 'image' ? '/images/filename.jpg' : '/docs/filename.pdf'
                  }
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowMaterialForm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={submitMaterial}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={!newMaterial.title || !newMaterial.url}
              >
                {editingMaterial ? 'Update' : 'Add'} Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
     </div>
  );
};

export default CoursesMaterialsManager;