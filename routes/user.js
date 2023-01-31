const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

// @desc    Sends User profile info
// @route   GET /user/profile
// @access  User
// Middleware needed
router.get("/profile", (req, res, next) => {
  const user = req.session.currentUser;
  res.render("user/profile", user);
});

// @desc    Deletes user and items from it from the database
// @route   GET /user/profile/delete
// @access  User
// Middleware needed
router.get("/profile/delete", async (req, res, next) => {
  const userId = req.session.currentUser._id;
  // To do: search in all user the objectIds (Orders f.e.) and delete them
  try {
    await User.findByIdAndDelete(userId); //implement on Restaurant Delete
    res.redirect("/auth/logout");
  } catch (error) {
    next(error);
  }
});

// @desc    Sends user form with previous values for editing
// @route   GET /user/edit
// @access  user
// Middleware needed
router.get("/profile/edit", (req, res, next) => {
  const user = req.session.currentUser;
  res.render("user/profileEdit", user);
});

// @desc    Sends restaurant form with previous values for editing
// @route   POST /restaurant/edit
// @access  Restaurants
router.post("/profile/edit", async (req, res, next) => {
  const {
    username,
    surname,
    direction,
    email,
    password1,
    password2,
    phoneNumber,
    paymentCard,
  } = req.body;
  if (
    !username ||
    !surname ||
    !direction ||
    !email ||
    !password1 ||
    !password2 ||
    !phoneNumber ||
    !paymentCard
  ) {
    res.render("user/profileEdit", { error: "Must fill all fields" });
    return;
  }
  const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  if (!regexEmail.test(email)) {
    res.render("user/profileEdit", {
      error: "Must provide a valid email",
    });
    return;
  }
  const regexPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  if (!regexPassword.test(password1)) {
    res.render("./user/profileEdit", {
      error:
        "Password must have at least 8 characters and contain one uppercase and lowercase letter, a special character and a number",
    });
    return;
  }
  if (!regexPassword.test(password2)) {
    res.render("user/profileEdit", {
      error: "Doublecheck the password on both fields",
    });
    return;
  }
  const regexPhone = /^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/;
  if (!regexPhone.test(phoneNumber)) {
    res.render("user/profileEdit", {
      error: "Correct phone number is required",
    });
    return;
  }
  if (!password1 === password2) {
    res.render("user/profileEdit", {
      error: "Doublecheck the password on both fields",
    });
    return;
  }
  const userId = req.session.currentUser._id;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password1, salt);
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        username,
        surname,
        direction,
        email,
        phoneNumber,
        hashedPassword,
        paymentCard,
      },
      { new: true }
    );
    req.session.currentUser = user;
    res.redirect("/user/profile");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
