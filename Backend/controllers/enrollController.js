import EnrolledCourse from '../models/EnrolledCourse.js';
 
export const enrollStudent = async (req, res) => {
  const studentId = req.user.id;
  const courseId = req.params.courseId;

  try {
    const existing = await EnrolledCourse.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    const enrollment = new EnrolledCourse({ student: studentId, course: courseId });
    await enrollment.save();

    res.status(201).json({ message: 'Enrollment successful' });
  } catch (err) {
    console.error('Enrollment Error:', err);
    res.status(500).json({ message: 'Server error during enrollment' });
  }
};

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await EnrolledCourse.find()
      .populate({
        path: 'student',
        select: 'name email' // select relevant student fields
      })
      .populate({
        path: 'course',
        select: 'title price'
      });

    res.status(200).json(enrollments);
  } catch (err) {
    console.error("Error fetching enrollments:", err);
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};


export const getMyEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const enrollments = await EnrolledCourse.find({ student: studentId })
      .populate({
        path: 'course',
        populate: { path: 'instructor' }
      });

    const result = enrollments.map(enroll => ({
      ...enroll.toObject(),
      course: enroll.course
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
};

export const saveVideoProgress = async (req, res) => {
  const { videoTitle, currentTime, duration, progressPercentage, completed, watchTime, chaptersCompleted, quality, playbackRate } = req.body;
  const studentId = req.user.id;
  const courseId = req.params.courseId;

  try {
    let enrollment = await EnrolledCourse.findOne({ student: studentId, course: courseId });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Initialize videoProgress array if it doesn't exist
    if (!enrollment.videoProgress) {
      enrollment.videoProgress = [];
    }

    // Find or create progress entry for this video
    const progressIndex = enrollment.videoProgress.findIndex(
      progress => progress.videoTitle === videoTitle
    );

    const progressData = {
      videoTitle,
      currentTime,
      duration,
      progressPercentage,
      completed,
      watchTime,
      chaptersCompleted: chaptersCompleted || [],
      quality,
      playbackRate,
      lastWatched: new Date()
    };

    if (progressIndex >= 0) {
      // Update existing progress
      enrollment.videoProgress[progressIndex] = {
        ...enrollment.videoProgress[progressIndex],
        ...progressData
      };
    } else {
      // Add new progress
      enrollment.videoProgress.push(progressData);
    }

    await enrollment.save();
    
    res.status(200).json({ 
      message: 'Progress saved successfully',
      progress: progressData 
    });
  } catch (err) {
    console.error('Save Progress Error:', err);
    res.status(500).json({ message: 'Failed to save video progress' });
  }
};

export const getVideoProgress = async (req, res) => {
  const studentId = req.user.id;
  const { courseId, videoTitle } = req.params;

  try {
    const enrollment = await EnrolledCourse.findOne({ 
      student: studentId, 
      course: courseId 
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const progress = enrollment.videoProgress?.find(
      p => p.videoTitle === videoTitle
    );

    if (!progress) {
      return res.status(200).json({ message: 'No progress found' });
    }

    res.status(200).json(progress);
  } catch (err) {
    console.error('Get Progress Error:', err);
    res.status(500).json({ message: 'Failed to fetch video progress' });
  }
};