import Course from '../models/Course.js';
import Instructor from '../models/Instructor.js';
import mongoose from 'mongoose';

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, level, price, duration, instructorId, videos, materials } = req.body;
    
    let instructorObjectId;
    
    if (instructorId) {
      let instructor = await Instructor.findOne({ customId: instructorId });
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
      duration,
      videos: videos || [],
      materials: materials || [], // Include materials if provided
    });

    await course.save();
    await course.populate('instructor', 'name email customId');

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error creating course', error: error.message });
  }
};

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
    console.error('Get all courses error:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error fetching course' });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { title, description, category, level, price, duration, videos, materials } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update course fields if provided
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;
    if (price !== undefined) course.price = price;
    if (duration !== undefined) course.duration = duration;
    if (videos) course.videos = videos;
    if (materials) course.materials = materials; // Update materials if provided

    course.updatedAt = new Date();
    await course.save();
    await course.populate('instructor', 'name email');

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error updating course', error: error.message });
  }
};

export const addVideoToCourse = async (req, res) => {
  try {
    const { title, filename, url, bunnyFileId, duration, order, chapters } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.videos.push({ title, filename, url, bunnyFileId, duration, order, chapters: chapters || [] });
    course.updatedAt = new Date();
    await course.save();

    res.json({ message: 'Video added to course successfully', course });
  } catch (error) {
    console.error('Add video error:', error);
    res.status(500).json({ message: 'Server error adding video to course' });
  }
};

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
    console.error('Add thumbnail error:', error);
    res.status(500).json({ message: 'Server error adding thumbnail to course' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error deleting course' });
  }
};