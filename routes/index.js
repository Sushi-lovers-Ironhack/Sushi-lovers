const router = require("express").Router();

// @desc    App home page
// @route   GET /
// @access  Public
router.get("/", (req, res, next) => {
  const user = req.session.currentUser;
  res.render("home/home", user);
});

module.exports = router;
