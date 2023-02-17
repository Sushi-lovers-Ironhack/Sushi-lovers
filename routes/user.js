const User = require("../models/User");
const Cart = require("../models/Cart");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { isUser, isLoggedIn } = require("../middlewares");

// @desc    Sends User profile info
// @route   GET /user/profile
// @access  User
router.get("/profile", isLoggedIn, isUser, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const orderActive = await Cart.findOne({
      userId: user._id,
      isOrdered: true,
      isFinished: false,
    });
    res.render("user/profile", { user, orderActive });
  } catch (error) {
    next(error);
  }
});

// @desc    Shows user past orders
// @route   GET /user/pastOrders
// @access  User
router.get("/pastOrders", isLoggedIn, isUser, async (req, res, next) => {
  const username = req.session.currentUser;
  try {
    const pastOrders = await Cart.find({
      $and: [{ userId: username._id }, { isFinished: true }],
    })
      .populate("restaurantId")
      .populate("productsId");
    for (order of pastOrders) {
      order["amount"] = order.productsId.length;
      order["price"] = order.productsId.reduce(
        (accumulator, product) => accumulator + product.price,
        0
      );
    }
    res.render("user/pastOrders", { username, pastOrders });
  } catch (error) {
    next(error);
  }
});

// @desc    Reorders past order
// @route   GET /user/pastOrder/:orderId/reorder
// @access  User
router.get(
  "/pastOrder/:orderId/reorder",
  isLoggedIn,
  isUser,
  async (req, res, next) => {
    const { orderId } = req.params;
    try {
      const oldOrder = await Cart.findById({ _id: orderId });
      const { userId, restaurantId, productsId } = oldOrder;
      const newOrder = await Cart.create({
        userId: userId,
        restaurantId: restaurantId,
        productsId: productsId,
      });
      res.redirect(`/cart/checkout/${newOrder._id}`);
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Shows user detail of a past order, and allows to reorder it
// @route   GET /user/pastOrder/:orderId
// @access  User
router.get(
  "/pastOrder/:orderId",
  isLoggedIn,
  isUser,
  async (req, res, next) => {
    const username = req.session.currentUser;
    const { orderId } = req.params;
    try {
      const orderDB = await Cart.findById({ _id: orderId })
        .populate("restaurantId")
        .populate("productsId");
      let filterOfProducts = [];
      let filteredArray = [];
      for (let product of orderDB.productsId) {
        if (!filterOfProducts.includes(String(product._id))) {
          product["quantity"] = orderDB.productsId.filter((productDB) =>
            productDB["_id"].equals(product._id)
          ).length;
          filteredArray.push(product);
          filterOfProducts.push(String(product._id));
        }
      }
      res.render("user/pastOrderDetail", { username, orderDB, filteredArray });
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Deletes user and items from it from the database
// @route   GET /user/profile/delete
// @access  User
router.get("/profile/delete", isLoggedIn, isUser, async (req, res, next) => {
  const userId = req.session.currentUser._id;
  try {
    await User.findByIdAndDelete(userId);
    res.redirect("/auth/logout");
  } catch (error) {
    next(error);
  }
});

// @desc    Sends user form with previous values for editing
// @route   GET /user/profile/edit
// @access  User
router.get("/profile/edit", isLoggedIn, isUser, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const orderActive = await Cart.findOne({
      userId: user._id,
      isOrdered: true,
      isFinished: false,
    });
    res.render("user/profileEdit", { user, username: user, orderActive });
  } catch (error) {
    next(error);
  }
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
    res.render("user/profileEdit", {
      error: "Must fill all fields",
      user,
      username: user,
    });
    return;
  }
  const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  if (!regexEmail.test(email)) {
    res.render("user/profileEdit", {
      error: "Must provide a valid email",
      user,
      username: user,
    });
    return;
  }
  const regexPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  if (!regexPassword.test(password1)) {
    res.render("./user/profileEdit", {
      error:
        "Password must have at least 8 characters and contain one uppercase and lowercase letter, a special character and a number",
      user,
      username: user,
    });
    return;
  }
  if (!regexPassword.test(password2)) {
    res.render("user/profileEdit", {
      error: "Doublecheck the password on both fields",
      user,
      username: user,
    });
    return;
  }
  const regexPhone = /^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/;
  if (!regexPhone.test(phoneNumber)) {
    res.render("user/profileEdit", {
      error: "Correct phone number is required",
      user,
      username: user,
    });
    return;
  }
  if (!password1 === password2) {
    res.render("user/profileEdit", {
      error: "Doublecheck the password on both fields",
      user,
      username: user,
    });
    return;
  }
  const userId = req.session.currentUser._id;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password1, salt);
    const editUser = await User.findByIdAndUpdate(
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
    req.session.currentUser = editUser;
    res.redirect("/user/profile");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
