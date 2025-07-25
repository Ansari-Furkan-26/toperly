import Course from '../models/Course.js';
import Instructor from '../models/Instructor.js';
import mongoose from 'mongoose';

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, level, price, duration, instructorId } = req.body;
    
    let instructorObjectId;
    
    if (instructorId) {
      // Try to find by customId first
      let instructor = await Instructor.findOne({ customId: instructorId });
      
      // If not found by customId, check if it's a valid ObjectId before trying findById
      if (!instructor && mongoose.Types.ObjectId.isValid(instructorId)) {
        instructor = await Instructor.findById(instructorId);
      }
      
      if (!instructor) {
        return res.status(404).json({ 
          message: 'Instructor not found. Please provide a valid instructor customId or ObjectId.' 
        });
      }
      
      instructorObjectId = instructor._id;
    } else if (req.user?.id) {
      // Use authenticated user's ID
      instructorObjectId = req.user.id;
    } else {
      return res.status(400).json({ message: 'Instructor ID is required' });
    }

    const course = new Course({
      title,
      description,
      instructor: instructorObjectId,
      category,
      level,
      price,
      duration
    });

    await course.save();
    await course.populate('instructor', 'name email customId');

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error creating course' });
  }
};



// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const { category, level, instructor } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (instructor) filter.instructor = instructor;

    const courses = await Course.find(filter)
      .populate('instructor', 'name email bio expertise')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching courses' });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email bio expertise')
      .populate('enrolledStudents', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching course' });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating course' });
  }
};

// Add video to course
export const addVideoToCourse = async (req, res) => {
  try {
    const { title, filename, url, bunnyFileId, duration, order } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.videos.push({ title, filename, url, bunnyFileId, duration, order });
    course.updatedAt = new Date();
    await course.save();

    res.json({ message: 'Video added to course successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding video to course' });
  }
};

// Add thumbnail to course
export const addThumbnailToCourse = async (req, res) => {
  try {
    const { filename, url, bunnyFileId } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.thumbnail = { filename, url, bunnyFileId };
    course.updatedAt = new Date();
    await course.save();

    res.json({ message: 'Thumbnail added to course successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding thumbnail to course' });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting course' });
  }
};
