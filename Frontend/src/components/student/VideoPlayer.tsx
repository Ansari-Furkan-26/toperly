import React from 'react';
import { Lock, Play } from 'lucide-react';

const VideoPlayer = ({ video, isEnrolled, course, onEnroll, enrollmentLoading, showToast }) => {
  if (!video || !isEnrolled) {
    return (
      <div className="w-full h-64 md:h-96 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
        {course?.thumbnail?.url && (
          <img src={course.thumbnail.url} className="absolute w-full h-full object-cover opacity-30" />
        )}
        <div className="text-center text-white z-10">
          <Lock size={48} className="mx-auto mb-4 opacity-60" />
          <h3 className="text-lg font-semibold mb-2">Content Locked</h3>
          <p className="text-gray-300 mb-4">Enroll in this course to access the videos</p>
          <button
            onClick={onEnroll}
            disabled={enrollmentLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {enrollmentLoading ? 'Enrolling...' : (course?.price === 0 ? 'Enroll for Free' : 'Enroll Now')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden relative">
      <video
        key={video.url}
        controls
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        className="w-full h-64 md:h-96"
        poster={course.thumbnail?.url}
        preload="metadata"
        crossOrigin="anonymous"
        onContextMenu={(e) => e.preventDefault()}
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="bg-gray-800 text-white p-3">
        <h4 className="font-medium">{video.title}</h4>
        <p className="text-sm text-gray-300">Lesson {video.order}</p>
      </div>
      <div className="absolute bottom-16 right-4 text-white text-xs opacity-50">© Protected Content</div>
    </div>
  );
};

export default VideoPlayer;
