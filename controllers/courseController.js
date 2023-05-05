const Course = require('../models/Course'); // course model
const Category = require('../models/Category'); // category model

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories; // req.query: Yönlendirmede her sorgu metni parametresi için bir özellik içeren nesnedir
    const category = await Category.findOne({ slug: categorySlug }); // parametreden gelen filtreleme
    let filter = {};

    if (categorySlug) {
      filter = { category: category._id};
    }

    const courses = await Course.find(filter).sort('-createdAt'); // courses?categories=<category_name>
    const categories = await Category.find();

    res.status(200).render('courses', {
      courses,
      categories,
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
    res.status(201).redirect('/courses');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    }); // bad request için 400 kodu
  }
};
