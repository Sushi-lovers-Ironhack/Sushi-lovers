const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { isUser, isLoggedIn } = require("../middlewares");

// @desc    Sends User profile info
// @route   GET /user/profile
// @access  User
router.get("/profile", isLoggedIn, isUser, (req, res, next) => {
  const user = req.session.currentUser;
  res.render("user/profile", user);
});

// @desc    Deletes user and items from it from the database
// @route   GET /user/profile/delete
// @access  User
router.get("/profile/delete", isLoggedIn, isUser, async (req, res, next) => {
  const userId = req.session.currentUser._id;
  // Backlog to do: search in all user the objectIds (Orders f.e.) and delete them
  try {
    await User.findByIdAndDelete(userId); //implement on Restaurant Delete
    res.redirect("/auth/logout");
  } catch (error) {
    next(error);
  }
});

// @desc    Sends user form with previous values for editing
// @route   GET /user/profile/edit
// @access  User
router.get("/profile/edit", isLoggedIn, isUser, (req, res, next) => {
  const user = req.session.currentUser;
  res.render("user/profileEdit", {user, username: user});
});

// @desc    Sends User form with previous values for editing
// @route   POST /user/profile/edit
// @access  User
router.post("/profile/edit", isLoggedIn, isUser, async (req, res, next) => {
  const user = req.session.currentUser;
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
    res.render("user/profileEdit", { error: "Must fill all fields", user, username: user });
    return;
  }
  const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  if (!regexEmail.test(email)) {
    res.render("user/profileEdit", {
      error: "Must provide a valid email",  user, username: user 
    });
    return;
  }
  const regexPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  if (!regexPassword.test(password1)) {
    res.render("./user/profileEdit", {
      error:
        "Password must have at least 8 characters and contain one uppercase and lowercase letter, a special character and a number",  user, username: user 
    });
    return;
  }
  if (!regexPassword.test(password2)) {
    res.render("user/profileEdit", {
      error: "Doublecheck the password on both fields",  user, username: user 
    });
    return;
  }
  const regexPhone = /^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/;
  if (!regexPhone.test(phoneNumber)) {
    res.render("user/profileEdit", {
      error: "Correct phone number is required",  user, username: user 
    });
    return;
  }
  if (!password1 === password2) {
    res.render("user/profileEdit", {
      error: "Doublecheck the password on both fields",  user, username: user 
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
