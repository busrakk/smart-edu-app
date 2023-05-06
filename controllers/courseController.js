const Course = require('../models/Course'); // course model
const Category = require('../models/Category'); // category model
const User = require('../models/User'); // user model

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories; // req.query: Yönlendirmede her sorgu metni parametresi için bir özellik içeren nesnedir
    const category = await Category.findOne({ slug: categorySlug }); // parametreden gelen filtreleme
    let filter = {};

    if (categorySlug) {
      filter = { category: category._id };
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

// populate: bir koleksiyon içerisinde farklı bir koleksiyon ile ilişki kurulduğu zaman, bir sorgu içerisinde koleksiyon verilerini alırken ilişkili koleksiyon verisini de veritabanından çekme
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      'user'
    );
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
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID, // hangi user olduğunu belirleme
    });
    res.status(201).redirect('/courses');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    }); // bad request için 400 kodu
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.push({ _id: req.body.course_id }); // inputtandan gelen id
    await user.save();
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    }); // bad request için 400 kodu
  }
};
