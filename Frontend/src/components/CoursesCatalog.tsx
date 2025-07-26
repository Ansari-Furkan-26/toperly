// components/CoursesCatalog.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Clock, Users, Play, BookOpen,Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CoursesCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const navigate = useNavigate();
  const {user, token} = useAuth();
  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    fetchCourses();

  }, [searchTerm, selectedCategory, selectedLevel]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/courses`;
      const params = new URLSearchParams();
      
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedLevel) params.append('level', selectedLevel);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        let filteredCourses = data;
        
        // Filter by search term
        if (searchTerm) {
          filteredCourses = data.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setCourses(filteredCourses);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(course => course.category))];
        setCategories(uniqueCategories);
      }

      if (user?.id) {
  const res = await fetch(`${API_BASE}/wishlist/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  setWishlist(data.map(course => course._id));
}
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  

  const CourseCard = ({ course }) => {
    const isWishlisted = wishlist.includes(course._id);
const toggleWishlist = async () => {
  const endpoint = `${API_BASE}/wishlist/${course._id}`;
  const method = isWishlisted ? 'DELETE' : 'POST';

  const res = await fetch(endpoint, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    setWishlist(prev =>
      isWishlisted ? prev.filter(id => id !== course._id) : [...prev, course._id]
    );
  }
};
  return <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200">
    {/* Course Thumbnail */}
    <div className="relative h-44 bg-gray-100">
      <button
  onClick={toggleWishlist}
  className="absolute top-3 right-12 z-10 bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-100"
>
  <Heart
    size={18}
    className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}
  />
</button>
      {course.thumbnail ? (
        <img 
          src={course.thumbnail.url} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <Play size={32} className="text-gray-400" />
        </div>
      )}
      
      {/* Price Badge */}
      <div className="absolute top-3 right-3">
        <span className="bg-white px-2.5 py-1 rounded-md text-sm font-semibold text-gray-800 shadow-sm border border-gray-200">
          ${course.price}
        </span>
      </div>
      
      {/* Level Badge */}
      <div className="absolute top-3 left-3">
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
          course.level === 'beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          course.level === 'intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          {course.level}
        </span>
      </div>
    </div>
    
    {/* Card Content */}
    <div className="p-5">
      {/* Course Title */}
      <h3 className="font-semibold text-lg text-gray-900 mb-3 leading-tight line-clamp-2">
        {course.title}
      </h3>
      
      {/* Instructor */}
      <div className="flex items-center mb-4">
        <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center mr-2.5">
          <span className="text-xs font-semibold text-gray-600">
            {course.instructor.name.charAt(0)}
          </span>
        </div>
        <span className="text-sm text-gray-600 font-medium">
          {course.instructor.name}
        </span>
      </div>
      
      {/* Quick Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
        <div className="flex items-center">
          <Clock size={14} className="mr-1.5" />
          <span>{course.duration || 0}h</span>
        </div>
        <div className="flex items-center">
          <Star size={14} className="text-amber-400 fill-current mr-1" />
          <span className="font-medium">4.8</span>
        </div>
      </div>
      
      {/* Action Button */}
      <button
        onClick={() => navigate(`/courses/${course._id}`)}
        className="w-full bg-gray-900 text-white py-2.5 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium text-sm"
      >
        View Course
      </button>
    </div>
  </div>
};



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Courses</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesCatalog;
