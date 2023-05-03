const Course = require('../models/Course'); // course model

exports.createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  try {
    res.status(201).json({
      status: 'success',
      course,
    }); // yeni oluşturulduğu için 201 kodu
  } catch {
    res.status(400).json({
      status: 'fail',
      error,
    }); // bad request için 400 kodu
  }
};
