import React from 'react';
import { Lock, Play } from 'lucide-react';

const CourseContentList = ({ course, currentVideo, setCurrentVideo, isEnrolled, showToast }) => {
  if (!course?.videos || course.videos.length === 0) {
    return <div className="text-center text-gray-500 py-4">No lessons available yet</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Course Content</h3>
      <div className="space-y-2">
        {course.videos.map((video) => (
          <div
            key={video._id}
            className={`flex items-center p-3 rounded-lg cursor-pointer ${
              currentVideo?._id === video._id
                ? 'bg-blue-100 border border-blue-300'
                : isEnrolled
                ? 'hover:bg-gray-100'
                : 'cursor-not-allowed opacity-75'
            }`}
            onClick={() => {
              if (isEnrolled) setCurrentVideo(video);
              else showToast('Please enroll to access the videos', 'info');
            }}
          >
            <div className="mr-3">
              {isEnrolled ? <Play size={16} className="text-blue-600" /> : <Lock size={16} />}
            </div>
            <div>
              <div className="text-sm font-medium">{video.title}</div>
              <div className="text-xs text-gray-500">Lesson {video.order}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContentList;
