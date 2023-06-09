const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
  },
  // course - category ilişkisi
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  // course - teacher 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

CourseSchema.pre('validate', function (next) {
  this.slug = slugify(this.name, {
    lower: true, // küçük harfe dönüştürme
    strict: true, // özel karakterleri çıkartma
  });
  next();
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
