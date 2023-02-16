const Restaurant = require("../models/Restaurant");
const Cart = require("../models/Cart");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { isRestaurant, isLoggedIn } = require("../middlewares");

// @desc    Sends restaurant profile info
// @route   GET /restaurant/profile
// @access  Restaurants
router.get("/profile", isLoggedIn, isRestaurant, (req, res, next) => {
  const restaurant = req.session.currentUser;
  res.render("restaurant/profile", restaurant);
});

// @desc    Deletes restaurant and items from it from the database
// @route   GET /restaurant/profile/delete
// @access  Restaurants
router.get(
  "/profile/delete",
  isLoggedIn,
  isRestaurant,
  async (req, res, next) => {
    const restaurantId = req.session.currentUser._id;
    try {
      await Restaurant.findByIdAndDelete(restaurantId);
      res.redirect("/auth/logout");
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Sends restaurant form with previous values for editing
// @route   GET /restaurant/profile/edit
// @access  Restaurants
router.get("/profile/edit", isLoggedIn, isRestaurant, (req, res, next) => {
  const restaurant = req.session.currentUser;
  res.render("restaurant/profileEdit", { restaurant, name: restaurant });
});

// @desc    Sends restaurant form with previous values for editing
// @route   POST /restaurant/profile/edit
// @access  Restaurants
router.post(
  "/profile/edit",
  isLoggedIn,
  isRestaurant,
  async (req, res, next) => {
    const restaurant = req.session.currentUser;
    const {
      name,
      email,
      password1,
      password2,
      direction,
      phoneNumber,
      description,
      imageUrl,
      logoUrl,
    } = req.body;
    if (
      !name ||
      !email ||
      !password1 ||
      !password2 ||
      !direction ||
      !phoneNumber ||
      !description ||
      !logoUrl
    ) {
      res.render("restaurant/profileEdit", {
        error: "Must fill all fields",
        restaurant,
        name: restaurant,
      });
      return;
    }
    const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    if (!regexEmail.test(email)) {
      res.render("restaurant/profileEdit", {
        error: "Must provide a valid email",
      });
      return;
    }
    const regexPassword =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    if (!regexPassword.test(password1)) {
      res.render("restaurant/profileEdit", {
        error:
          "Password must have at least 8 characters and contain one uppercase and lowercase letter, a special character and a number",
        restaurant,
        name: restaurant,
      });
      return;
    }
    if (!regexPassword.test(password2)) {
      res.render("restaurant/profileEdit", {
        error: "Doublecheck the password on both fields",
        restaurant,
        name: restaurant,
      });
      return;
    }
    const regexPhone = /^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/;
    if (!regexPhone.test(phoneNumber)) {
      res.render("restaurant/profileEdit", {
        error: "Correct phone number is required",
        restaurant,
        name: restaurant,
      });
      return;
    }
    if (!password1 === password2) {
      res.render("restaurant/profileEdit", {
        error: "Doublecheck the password on both fields",
        restaurant,
        name: restaurant,
      });
      return;
    }
    const restaurantId = req.session.currentUser._id;
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password1, salt);
      const restaurant = await Restaurant.findByIdAndUpdate(
        { _id: restaurantId },
        {
          name,
          email,
          hashedPassword,
          direction,
          phoneNumber,
          description,
          imageUrl,
          logoUrl,
        },
        { new: true }
      );
      req.session.currentUser = restaurant;
      res.redirect("/restaurant/profile");
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Gets current orders and allows restaurant to manage them
// @route   GET /restaurant
// @access  Restaurants
router.get("/", isLoggedIn, isRestaurant, async (req, res, next) => {
  const restaurant = req.session.currentUser;
  const opened = restaurant.status;
  try {
    const currentOrdersDB = await Cart.find({
      $and: [
        { restaurantId: restaurant._id },
        { isFinished: false },
        { isOrdered: true },
        { isSent: false },
      ],
    }).populate("userId");
    let incomingOrders = [],
      pendingOrders = [];
    for (let order of currentOrdersDB) {
      order["numberProducts"] = order.productsId.length;
      if (order.isPending == true) {
        incomingOrders.push(order);
      } else {
        pendingOrders.push(order);
      }
    }
    res.render("restaurant/home", {
      restaurant,
      name: restaurant,
      incomingOrders,
      pendingOrders,
      opened,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Opens/closed the restaurant to be seen in the app for users
// @route   GET /restaurant/status
// @access  Restaurants
router.get("/status", isLoggedIn, isRestaurant, async (req, res, next) => {
  const restaurant = req.session.currentUser;
  let opened;
  try {
    if (restaurant.status == true) {
      opened = await Restaurant.findByIdAndUpdate(
        { _id: restaurant._id },
        { status: false },
        { new: true }
      );
    } else {
      opened = await Restaurant.findByIdAndUpdate(
        { _id: restaurant._id },
        { status: true },
        { new: true }
      );
    }
    req.session.currentUser = opened;
    res.redirect("/restaurant");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
