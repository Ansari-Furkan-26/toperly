import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  customId: { type: String, unique: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  category: { type: String, required: true },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  price: { type: Number, required: true, min: 0 },
  duration: { type: Number }, // in hours
  thumbnail: {
    filename: String,
    url: String,
    bunnyFileId: String
  },
  videos: [{
    title: String,
    filename: String,
    url: String,
    bunnyFileId: String,
    duration: Number,
    order: Number
  }],
  materials: [{
    title: String,
    filename: String,
    url: String,
    bunnyFileId: String,
    type: { type: String, enum: ['pdf', 'image', 'document'] }
  }],
  isPublished: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


// Auto-generate customId
courseSchema.pre('save', async function (next) {
  if (this.isNew && !this.customId) {
    try {
      const Counter = (await import('./Counter.js')).default;
      const counter = await Counter.findOneAndUpdate(
        { model: 'Course' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      
      const serialNo = counter.seq.toString().padStart(4, '0');
      const sanitizedTitle = this.title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      this.customId = `CRS-${sanitizedTitle.substring(0, 10)}-${serialNo}`;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default Course;
