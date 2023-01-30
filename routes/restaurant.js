const Restaurant = require('../models/Restaurant');
const router = require('express').Router();

// @desc    Sends restaurant profile info
// @route   POST /restaurant/profile
// @access  Restaurants
router.get('/profile', (req, res, next) => {
    const restaurant = req.session.currentUser;
    res.render("./restaurant/profile", restaurant);
});

module.exports = router;