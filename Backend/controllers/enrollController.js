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
