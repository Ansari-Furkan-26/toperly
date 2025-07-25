import Student from '../models/Student.js';

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
