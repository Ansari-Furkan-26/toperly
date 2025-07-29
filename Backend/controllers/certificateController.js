// controllers/certificateController.js
import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';

// Create Certificate
export const createCertificate = async (req, res) => {
  try {
    const { 
      student, 
      studentName, 
      studentCustomId, 
      course, 
      courseName, 
      author, 
      certificateUrl, 
      marks 
    } = req.body;

    // Validate required fields
    if (!student || !studentName || !studentCustomId || !course || !courseName || !author || !certificateUrl || marks === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate marks
    if (marks < 80) {
      return res.status(400).json({
        success: false,
        message: 'Minimum 80% marks required for certificate'
      });
    }

    // Verify student and course exist
    const studentExists = await Student.findById(student);
    const courseExists = await Course.findById(course);

    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if certificate already exists for this student-course combination
    const existingCertificate = await Certificate.findOne({ student, course });
    if (existingCertificate) {
      return res.status(409).json({
        success: false,
        message: 'Certificate already exists for this student and course'
      });
    }

    const certificate = new Certificate({
      student,
      studentName,
      studentCustomId,
      course,
      courseName,
      author,
      certificateUrl,
      marks
    });

    await certificate.save();

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate('student', 'name email')
      .populate('course', 'title');

    res.status(201).json({
      success: true,
      message: 'Certificate created successfully',
      data: populatedCertificate
    });

  } catch (error) {
    console.error('Create certificate error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Certificate already exists for this student and course'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create certificate',
      error: error.message
    });
  }
};

// Get All Certificates
export const getAllCertificates = async (req, res) => {
  try {
    const { student, course, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (student) filter.student = student;
    if (course) filter.course = course;

    const skip = (page - 1) * limit;

    const certificates = await Certificate.find(filter)
      .populate('student', 'name email')
      .populate('course', 'title')
      .sort({ issuedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Certificate.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: certificates,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates',
      error: error.message
    });
  }
};

// Get Certificate by ID
export const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id)
      .populate('student', 'name email')
      .populate('course', 'title');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });

  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate',
      error: error.message
    });
  }
};

// Update Certificate
export const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, studentCustomId, courseName, author, certificateUrl, marks } = req.body;

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Validate marks if provided
    if (marks !== undefined && marks < 80) {
      return res.status(400).json({
        success: false,
        message: 'Minimum 80% marks required for certificate'
      });
    }

    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      { studentName, studentCustomId, courseName, author, certificateUrl, marks },
      { new: true, runValidators: true }
    ).populate('student', 'name email').populate('course', 'title');

    res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      data: updatedCertificate
    });

  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update certificate',
      error: error.message
    });
  }
};

// Delete Certificate
export const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    await Certificate.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully'
    });

  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete certificate',
      error: error.message
    });
  }
};

// Get Student Certificates
export const getStudentCertificates = async (req, res) => {
  try {
    const { studentId } = req.params;

    const certificates = await Certificate.find({ student: studentId })
      .populate('course', 'title')
      .sort({ issuedAt: -1 });

    res.status(200).json({
      success: true,
      data: certificates
    });

  } catch (error) {
    console.error('Get student certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student certificates',
      error: error.message
    });
  }
};
