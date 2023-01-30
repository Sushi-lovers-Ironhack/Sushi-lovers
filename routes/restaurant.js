const { findByIdAndDelete } = require('../models/Restaurant');
const Restaurant = require('../models/Restaurant');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

// @desc    Sends restaurant form with previous values for editing
// @route   GET /restaurant/edit
// @access  Restaurants
router.get('/profile/edit', (req, res, next) => {
    const restaurant = req.session.currentUser;
    res.render("./restaurant/profileEdit", restaurant);
});

// @desc    Sends restaurant form with previous values for editing
// @route   GET /restaurant/edit
// @access  Restaurants
router.post('/profile/edit', async (req, res, next) => {
    const { name, email, password1, password2, direction, phoneNumber, description, imageUrl } = req.body;
    if (!name || !email || !password1 || !password2 || !direction || !phoneNumber || !description) {
        res.render("./restaurant/profileEdit", {error: 'Must fill all fields'});
        return;
    };
    const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
    if (!regexEmail.test(email)) {
        res.render("./restaurant/profileEdit", {error: 'Must provide a valid email'});
        return;
    };
    const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    if (!regexPassword.test(password1)) {
        res.render("./restaurant/profileEdit", {error: 'Password must have at least 8 characters and contain one uppercase and lowercase letter, a special character and a number'});
        return;
    };
    if (!regexPassword.test(password2)) {
      res.render("./restaurant/profileEdit", {error: 'Doublecheck the password on both fields'});
      return;
    };
    const regexPhone = /^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/
    if (!regexPhone.test(phoneNumber)) {
      res.render("./restaurant/profileEdit", {error: 'Correct phone number is required'});
      return;
    };
    if (!password1 === password2) {
      res.render("./restaurant/profileEdit", {error: 'Doublecheck the password on both fields'});
      return;
    };
    const restaurantId = req.session.currentUser._id;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password1, salt);
        const restaurant = await Restaurant.findByIdAndUpdate({_id: restaurantId}, { name, email, hashedPassword, direction, phoneNumber, description, imageUrl }, {new: true});
        req.session.currentUser = restaurant;
        res.redirect('/restaurant/profile');
    } catch (error) {
        next(error);
    }
  });

module.exports = router;