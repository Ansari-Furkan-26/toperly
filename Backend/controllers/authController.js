import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Instructor from '../models/Instructor.js';

// JWT secret from env
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register handler (shared)
export const register = async (req, res) => {
  try {
    const { name, email, password, role, bio, expertise, phone, language } = req.body;
    console.log(name);
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }

    if (!['student', 'instructor'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either "student" or "instructor"' });
    }

    // Check if user already exists in either collection by email
    const existingInstructor = await Instructor.findOne({ email });
    const existingStudent = await Student.findOne({ email });
    if (existingInstructor || existingStudent) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === 'instructor') {
      newUser = new Instructor({
        name,
        email,
        password: hashedPassword,
        bio: bio || '',
        expertise: expertise || [],
        role
      });
    } else {
      // role == student
      newUser = new Student({
        name,
        email,
        passwordHash: hashedPassword,
        phone: phone || '',
        language: language || 'en',
        role
      });
    }

    await newUser.save();

    const token = generateToken(newUser);

    return res.status(201).json({
      message: `${role} registered successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login handler (shared)
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password and role are required' });
    }
    if (!['student', 'instructor'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either "student" or "instructor"' });
    }

    let user;
    if (role === 'instructor') {
      user = await Instructor.findOne({ email });
      if (!user) return res.status(404).json({ message: 'Instructor not found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    } else {
      // student
      user = await Student.findOne({ email });
      if (!user) return res.status(404).json({ message: 'Student not found' });

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    console.log(token);
    return res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// logout handler
export const logout = async (req, res) => {
  // If using cookies for JWT, clear them. Otherwise, instruct client to remove locally stored token.
  res.status(200).json({ message: 'Logout successful' });
};
