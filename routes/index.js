const router = require("express").Router();
const Restaurant = require("../models/Restaurant");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// @desc    App home page
// @route   GET /
// @access  Public
router.get("/", async (req, res, next) => {
  const username = req.session.currentUser;
  try {
    const restaurantsDB = await Restaurant.find({ status: true }).limit(4);
    const orderActive = await Cart.findOne({
      userId: username._id,
      isOrdered: true,
      isFinished: false,
    });
    res.render("home/home", { username, restaurantsDB, orderActive });
  } catch (error) {
    next(error);
  }
});

// @desc    Shows all restaurants
// @route   GET /search
// @access  Public
router.get("/search", async (req, res, next) => {
  const username = req.session.currentUser;
  try {
    const restaurantsOpenDB = await Restaurant.find({ status: true }).limit(10);
    const restaurantsClosedDB = await Restaurant.find({ status: false }).limit(
      10
    );
    const orderActive = await Cart.findOne({
      userId: username._id,
      isOrdered: true,
      isFinished: false,
    });
    res.render("home/search", {
      username,
      restaurantsOpenDB,
      restaurantsClosedDB,
      orderActive,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Shows restaurants which have matching name products
// @route   POST /search
// @access  Public
router.post("/search", async (req, res, next) => {
  const username = req.session.currentUser;
  const { search } = req.body;
  try {
    const matchingProductsDB = await Product.find({
      name: { $regex: search, $options: "i" },
    }).populate("restaurantId");
    let restaurantsDB = new Set(
      matchingProductsDB.map((product) => product.restaurantId)
    );
    restaurantsDB = Array.from(restaurantsDB);
    const openRestaurants = restaurantsDB.filter((res) => res.status);
    const closedRestaurants = restaurantsDB.filter((res) => !res.status);
    const orderActive = await Cart.findOne({
      userId: username._id,
      isOrdered: true,
      isFinished: false,
    });
    res.render("home/search", {
      username,
      openRestaurants,
      closedRestaurants,
      orderActive,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
