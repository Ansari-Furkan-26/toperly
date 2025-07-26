import Student from '../models/Student.js';
import Course from '../models/Course.js';

// CREATE Student (admin use)
export const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// READ all students (admin use)
export const getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

// READ student by ID
export const getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student Not Found' });
  res.json(student);
};

// UPDATE student (admin use)
export const updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!student) return res.status(404).json({ message: 'Student Not Found' });
  res.json(student);
};

// DELETE student (admin use)
export const deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student Not Found' });
  res.json({ message: "Student deleted" });
};

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: "Student or Course not found" });
    }

    // Check if already enrolled
    const alreadyEnrolled = student.enrolledCourses.some(
      (enrollment) => enrollment.courseId.toString() === courseId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Add course to student's enrolledCourses
    student.enrolledCourses.push({ courseId });
    await student.save();

    // Add student to course's enrolledStudents
    course.enrolledStudents.push(studentId);
    await course.save();

    res.status(200).json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error("Enrollment Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
