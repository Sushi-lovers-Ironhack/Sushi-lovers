const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// @desc    Displays form view to sign up
// @route   GET /auth/signup
// @access  Public
router.get('/signup', async (req, res, next) => {
  res.render('auth/signup');
})

// @desc    Displays form view  for restaurants to sign up
// @route   GET /restaurant/signup
// @access  Public
router.get("/restaurant/signup", (req, res, next) => {
  res.render("./auth/restaurantSignup");
});


// @desc    Sends restaurant auth data to database to create a new user
// @route   POST /restaurant/signup
// @access  Public
router.post("/restaurant/signup", async (req, res, next) => {
  const { name, email, password1, password2, direction, phoneNumber, description } = req.body;
  if (!name || !email || !password1 || !password2 || !direction || !phoneNumber || !description) {
      res.render(".//auth/restaurantSignup", {error: 'Must fill all fields'});
      return;
  };
  const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
  if (!regexEmail.test(email)) {
      res.render(".//auth/restaurantSignup", {error: 'Must provide a valid email'});
      return;
  };
  const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  if (!regexPassword.test(password1)) {
      res.render("./auth/restaurantSignup", {error: 'Password must have at least 8 characters and contain one uppercase and lowercase letter, a special character and a number'});
      return;
  };
  if (!regexPassword.test(password2)) {
    res.render("./auth/restaurantSignup", {error: 'Doublecheck the password on both fields'});
    return;
  };
  const regexPhone = /^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/
  if (!regexPhone.test(phoneNumber)) {
    res.render("./auth/restaurantSignup", {error: 'Correct phone number is required'});
    return;
  };
  if (!password1 === password2) {
    res.render("./auth/restaurantSignup", {error: 'Doublecheck the password on both fields'});
    return;
  };
  try {
      const foundUser = await Restaurant.findOne({ name });
      if (foundUser) {
          res.render("./auth/restaurantSignup", {error: 'Restaurant name alreday in use'});
          return;
      };
      const foundEmailRestaurant = await Restaurant.findOne({ email })
      const foundEmailUser = await User.findOne({ email });
      if (foundEmailUser || foundEmailRestaurant) {
          res.render("./auth/restaurantSignup", {error: 'Email already in use'});
          return;
      }
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password1, salt);
      await Restaurant.create({ name, email, hashedPassword, direction, phoneNumber, description });
      res.redirect('/login');
  } catch (error) {
      next(error);
  }
});

// @desc    Displays form view to log in
// @route   GET /auth/login
// @access  Public
router.get('/login', async (req, res, next) => {
  res.render('auth/login');
})

// @desc    Sends user auth data to database to create a new user
// @route   POST /auth/signup
// @access  Public
router.post('/signup', async (req, res, next) => {
  const { email, password, username } = req.body;
  // ⚠️ Add validations!
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ username, email, hashedPassword });
    res.render('auth/profile', user)
  } catch (error) {
    next(error)
  }
});

// @desc    Sends user auth data to database to authenticate user
// @route   POST /auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  // ⚠️ Add validations!
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.render('auth/login', { error: "User not found" });
      return;
    } else {
      const match = await bcrypt.compare(password, user.hashedPassword);
      if (match) {
        // Remember to assign user to session cookie:
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('auth/login', { error: "Unable to authenticate user" });
      }
    }
  } catch (error) {
    next(error);
  }
})

// @desc    Destroy user session and log out
// @route   POST /auth/logout
// @access  Private 
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.redirect('/auth/login');
    }
  });
})

module.exports = router;
