const Course = require('../models/Course'); // course model
const Category = require('../models/Category'); // category model
const User = require('../models/User'); // user model

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories; // req.query: Yönlendirmede her sorgu metni parametresi için bir özellik içeren nesnedir
    const query = req.query.search; // input name search olduğu için

    const category = await Category.findOne({ slug: categorySlug }); // parametreden gelen filtreleme
    let filter = {};

    if (categorySlug) {
      filter = { category: category._id };
    }

    if (query) {
      filter = { name: query };
    }

    if (!query && !categorySlug) {
      (filter.name = ''), (filter.category = null);
    }

    const courses = await Course.find({
      $or: [
        // regular expression
        { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
        { category: filter.category },
      ],
    })
      .sort('-createdAt')
      .populate('user'); // courses?categories=<category_name>
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
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      'user'
    );
    const categories = await Category.find();
    res.status(200).render('course', {
      // render('course') - views sayfası
      course,
      page_name: 'courses',
      user,
      categories,
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
    req.flash('success', `${course.name} has been created successfully`);
    res.status(201).redirect('/courses');
  } catch (error) {
    req.flash('error', 'Something happened!');
    res.status(400).redirect('/courses'); // bad request için 400 kodu
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.push({ _id: req.body.course_id }); // inputtan gelen id
    await user.save();
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    }); // bad request için 400 kodu
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id }); // inputtan gelen id
    await user.save();
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    }); // bad request için 400 kodu
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndRemove({ slug: req.params.slug });
    req.flash('success', `${course.name} has been removed successfully`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    }); // bad request için 400 kodu
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;
    await course.save();

    req.flash('success', `${course.name} has been updated successfully`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    }); // bad request için 400 kodu
  }
};
