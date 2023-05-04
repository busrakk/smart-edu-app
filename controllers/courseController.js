const Course = require('../models/Course'); // course model

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).render('courses', {
      courses,
      page_name: 'courses',
    });
    // res.status(200).json({
    //   status: 'success',
    //   courses,
    // }); // for postman
  } catch (error) {
    console.log(error);
    // res.status(400).json({
    //   status: 'fail',
    //   error,
    // }); // for postman
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    res.status(200).render('course', {
      // render('course') - views sayfası
      course,
      page_name: 'courses',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({
      status: 'success',
      course,
    }); // yeni oluşturulduğu için 201 kodu
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    }); // bad request için 400 kodu
  }
};
