// models/EnrolledCourse.js
import mongoose from 'mongoose';

const enrolledCourseSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 },
  completedLessons: [String],
  certificateIssued: { type: Boolean, default: false },
  enrolledAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

enrolledCourseSchema.index({ student: 1, course: 1 }, { unique: true });

const EnrolledCourse = mongoose.models.EnrolledCourse || mongoose.model('EnrolledCourse', enrolledCourseSchema);

export default EnrolledCourse;
