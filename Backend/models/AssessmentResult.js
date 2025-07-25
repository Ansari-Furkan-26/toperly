// models/AssessmentResult.js
import mongoose from 'mongoose';

const assessmentResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  testId: { type: String, required: true },
  score: Number,
  totalMarks: Number,
  passed: Boolean,
  answers: [{
    questionId: String,
    selected: String,
    correct: Boolean
  }],
  attemptedAt: Date
});

const AssessmentResult = mongoose.models.AssessmentResult || mongoose.model('AssessmentResult', assessmentResultSchema);

export default AssessmentResult;
