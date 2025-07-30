import React from 'react';
import { Award } from 'lucide-react';

const EnrollmentCard = ({ course, isEnrolled, onEnroll, enrollmentLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {course.price === 0 ? 'Free' : `$${course.price}`}
        </div>
        {course.price > 0 && <div className="text-sm text-gray-500 line-through">$999.99</div>}
      </div>

      {!isEnrolled ? (
        <button
          onClick={onEnroll}
          disabled={enrollmentLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg mb-4 disabled:opacity-50"
        >
          {enrollmentLoading ? 'Enrolling...' : (course.price === 0 ? 'Enroll for Free' : 'Enroll Now')}
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
        {course.price > 0 && <div>30-day money-back guarantee</div>}
      </div>
    </div>
  );
};

export default EnrollmentCard;
