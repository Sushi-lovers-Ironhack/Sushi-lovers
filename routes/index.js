const router = require("express").Router();
const Restaurant = require("../models/Restaurant");
const Product = require("../models/Product");

// @desc    App home page
// @route   GET /
// @access  Public
router.get("/", async (req, res, next) => {
  const username = req.session.currentUser;
  const restaurantsDB = await Restaurant.find({}).limit(4);
  res.render("home/home", {username, restaurantsDB});
});

// @desc    Shows all restaurants
// @route   GET /search
// @access  Public
router.get("/search", async (req, res, next) => {
  const username = req.session.currentUser;
  try {
    const restaurantsDB = await Restaurant.find({}).limit(10);
    res.render("home/search", {username, restaurantsDB});
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
  console.log(search);
  try {
    const matchingProductsDB = await Product.find({ name: search }).populate("restaurantId");
    const restaurantsDB = new Set(matchingProductsDB.map((product) => product.restaurantId));
    res.render("home/search", {username, restaurantsDB});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
