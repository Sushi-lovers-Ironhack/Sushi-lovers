const router = require("express").Router();
const Restaurant = require("../models/Restaurant");

// @desc    App home page
// @route   GET /
// @access  Public
router.get("/", async (req, res, next) => {
  const username = req.session.currentUser;
  const restaurantsDB = await Restaurant.find({}).limit(4);
  res.render("home/home", {username, restaurantsDB});
});

// @desc    App home page
// @route   GET /
// @access  Public


module.exports = router;
