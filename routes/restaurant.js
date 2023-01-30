const { findByIdAndDelete } = require('../models/Restaurant');
const Restaurant = require('../models/Restaurant');
const router = require('express').Router();

// @desc    Sends restaurant profile info
// @route   GET /restaurant/profile
// @access  Restaurants
router.get('/profile', (req, res, next) => {
    const restaurant = req.session.currentUser;
    res.render("./restaurant/profile", restaurant);
});

// @desc    Deletes restaurant and items from it from the database
// @route   GET /restaurant/profile/delete
// @access  Restaurants
router.get('/profile/delete', async (req, res, next) => {
    const restaurantId = req.session.currentUser._id;
    // To do: search all menu items from this restaurant and delete them
    try {
        await Restaurant.findByIdAndDelete(restaurantId);
        res.redirect("/auth/login");
    } catch (error) {
        next(error);
    }
});

module.exports = router;