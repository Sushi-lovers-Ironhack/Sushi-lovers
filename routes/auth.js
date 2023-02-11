const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// @desc    Displays form view  for restaurants to sign up
// @route   GET /restaurant/signup
// @access  Public
router.get("/restaurant/signup", (req, res, next) => {
  res.render("auth/restaurantSignup");
});

// @desc    Sends restaurant auth data to database to create a new user
// @route   POST /restaurant/signup
// @access  Public
router.post("/restaurant/signup", async (req, res, next) => {
  const {
    name,
    email,
    password1,
    password2,
    direction,
    phoneNumber,
    description,
  } = req.body;
  if (
    !name ||
    !email ||
    !password1 ||
    !password2 ||
    !direction ||
    !phoneNumber ||
    !description
  ) {
    res.render("auth/restaurantSignup", { error: "Must fill all fields" });
    return;
  }
  const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  if (!regexEmail.test(email)) {
    res.render("auth/restaurantSignup", {
      error: "Must provide a valid email",
    });
    return;
  }
  const regexPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  if (!regexPassword.test(password1)) {
    res.render("auth/restaurantSignup", {
      error:
        "Password must have at least 8 characters and contain one uppercase and lowercase letter, a special character and a number",
    });
    return;
  }
  if (!regexPassword.test(password2)) {
    res.render("auth/restaurantSignup", {
      error: "Doublecheck the password on both fields",
    });
    return;
  }
  const regexPhone = /^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/;
  if (!regexPhone.test(phoneNumber)) {
    res.render("auth/restaurantSignup", {
      error: "Correct phone number is required",
    });
    return;
  }
  if (!password1 === password2) {
    res.render("auth/restaurantSignup", {
      error: "Doublecheck the password on both fields",
    });
    return;
  }
  try {
    const foundUser = await Restaurant.findOne({ name });
    if (foundUser) {
      res.render("auth/restaurantSignup", {
        error: "Restaurant name already in use",
      });
      return;
    }
    const foundEmailRestaurant = await Restaurant.findOne({ email });
    const foundEmailUser = await User.findOne({ email });
    if (foundEmailUser || foundEmailRestaurant) {
      res.render("auth/restaurantSignup", { error: "Email already in use" });
      return;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password1, salt);
    const imageUrl =
      "https://media.istockphoto.com/id/847043282/photo/japanese-dining-healthy-food.jpg?s=612x612&w=0&k=20&c=VdK1FFqaJQik2CdMxI30ilk4581XHpEeaOQEUMAbujc=";
    const restaurant = await Restaurant.create({
      name,
      email,
      hashedPassword,
      direction,
      phoneNumber,
      description,
      imageUrl,
    });
    req.session.currentUser = restaurant;
    req.session.role = "restaurant";
    res.redirect("/restaurant/profile");
  } catch (error) {
    next(error);
  }
});

// @desc    Displays form view to log in
// @route   GET /auth/login
// @access  Public
router.get("/login", async (req, res, next) => {
  res.render("auth/login");
});

// @desc    Displays form view to sign up
// @route   GET /auth/signup
// @access  Public
router.get("/signup", async (req, res, next) => {
  res.render("auth/signup");
});

// @desc    Sends user auth data to database to create a new user
// @route   POST /auth/signup
// @access  Public
router.post("/signup", async (req, res, next) => {
  const {
    username,
    surname,
    direction,
    email,
    phoneNumber,
    password1,
    password2,
    paymentCard,
  } = req.body;
  if (
    !username ||
    !surname ||
    !email ||
    !password1 ||
    !password2 ||
    !direction ||
    !phoneNumber ||
    !paymentCard
  ) {
    res.render("auth/signup", { error: "Must fill all fields" });
    return;
  }
  const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  if (!regexEmail.test(email)) {
    res.render("auth/signup", {
      error: "Must provide a valid email",
    });
    return;
  }
  const regexPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  if (!regexPassword.test(password1)) {
    res.render("auth/signup", {
      error:
        "Password must have at least 8 characters and contain one uppercase and lowercase letter, a special character and a number",
    });
    return;
  }
  if (!regexPassword.test(password2)) {
    res.render("auth/signup", {
      error: "Doublecheck the password on both fields",
    });
    return;
  }
  const regexPhone = /^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/;
  if (!regexPhone.test(phoneNumber)) {
    res.render("auth/signup", {
      error: "Correct phone number is required",
    });
    return;
  }
  if (!password1 === password2) {
    res.render("auth/signup", {
      error: "Doublecheck the password on both fields",
    });
    return;
  }
  try {
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res.render("auth/signup", {
        error: "User name alreday in use",
      });
      return;
    }
    const foundEmailRestaurant = await Restaurant.findOne({ email });
    const foundEmailUser = await User.findOne({ email });
    if (foundEmailUser || foundEmailRestaurant) {
      res.render("auth/signup", { error: "Email already in use" });
      return;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password1, salt);
    const user = await User.create({
      username,
      surname,
      direction,
      email,
      phoneNumber,
      hashedPassword,
      paymentCard,
    });
    req.session.currentUser = user;
    req.session.role = "user";
    res.redirect("/user/profile");
  } catch (error) {
    next(error);
  }
});

// @desc    Sends user auth data to database to authenticate user
// @route   POST /auth/login
// @access  Public
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render("users/login", { error: "Must fill all fields" });
    return;
  }
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const match = await bcrypt.compare(password, user.hashedPassword);
      if (match) {
        req.session.currentUser = user;
        req.session.role = "user";
        res.redirect("/user/profile"); //¿como vuelve al carro?
      } else {
        res.render("auth/login", { error: "Unable to authenticate user" });
      }
    }
    const restaurant = await Restaurant.findOne({ email: email });
    if (restaurant) {
      const match = await bcrypt.compare(password, restaurant.hashedPassword);
      if (match) {
        req.session.currentUser = restaurant;
        req.session.role = "restaurant";
        res.redirect("/restaurant/profile");
      } else {
        res.render("auth/login", { error: "Unable to authenticate user" });
      }
    }
    res.render("auth/login", { error: "Unable to authenticate user" });
  } catch (error) {
    next(error);
  }
});

// @desc    Destroy user session and log out
// @route   GET /auth/logout
// @access  Private
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
