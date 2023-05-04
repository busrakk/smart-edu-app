const express = require('express');
const pageController = require('../controllers/pageControllers');

const router = express.Router();

router.route('/').get(pageController.getIndexPage);
router.route('/about').get(pageController.getAboutPage);
router.route('/register').get(pageController.getRegisterPage);

module.exports = router;
