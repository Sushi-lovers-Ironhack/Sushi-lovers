const router = require("express").Router();
const Product = require("../models/Product");
const { isRestaurant, isLoggedIn } = require("../middlewares");

// @desc    Menu view for the restaurant
// @route   GET /menu/
// @access  Restaurant
router.get("/", isLoggedIn, isRestaurant, async (req, res, next) => {
  const { name, _id } = req.session.currentUser;
  try {
    const products = await Product.find({ restaurantId: _id });
    let drinks = [],
      starters = [],
      dishes = [],
      desserts = [];
    for (let product of products) {
      if (product.category == "Drinks") {
        drinks.push(product);
      }
      if (product.category == "Starters") {
        ç;
        starters.push(product);
      }
      if (product.category == "Dishes") {
        dishes.push(product);
      }
      if (product.category == "Desserts") {
        desserts.push(product);
      }
    }
    res.render("menu/menu", { name, drinks, starters, dishes, desserts });
  } catch (error) {
    next(error);
  }
});

// @desc    Renders view to create a new product
// @route   GET /menu/add
// @access  Restaurant
router.get("/add", isLoggedIn, isRestaurant, (req, res, next) => {
  const user = req.session.currentUser;
  res.render("menu/menuAdd", user);
});

// @desc    Gets data from from and creates a new Product document
// @route   POST /menu/add
// @access  Restaurant
router.post("/add", isLoggedIn, isRestaurant, async (req, res, next) => {
  const restaurantId = req.session.currentUser._id;
  const { name, category, description, imageUrl, price } = req.body;
  try {
    await Product.create({
      name,
      category,
      description,
      imageUrl,
      price,
      restaurantId,
    });
    res.redirect("/menu");
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a product
// @route   GET /menu/:productId/delete
// @access  Restaurant
router.get(
  "/:productId/delete",
  isLoggedIn,
  isRestaurant,
  async (req, res, next) => {
    const { productId } = req.params;
    try {
      await Product.findByIdAndDelete({ _id: productId });
      res.redirect("/menu");
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Send data from the product to edit
// @route   GET /menu/:productId
// @access  Restaurant
router.get("/:productId", isLoggedIn, isRestaurant, async (req, res, next) => {
  const name = req.session.currentUser.name;
  const { productId } = req.params;
  try {
    const productDB = await Product.findById({ _id: productId });
    res.render("menu/menuEdit", { name, productDB });
  } catch (error) {
    next(error);
  }
});

// @desc    Gets edited data and updates on the database
// @route   POST /menu/productId
// @access  Restaurant
router.post("/:productId", isLoggedIn, isRestaurant, async (req, res, next) => {
  const { productId } = req.params;
  const { name, category, description, imageUrl, price } = req.body;
  try {
    await Product.findByIdAndUpdate(
      { _id: productId },
      { name, category, description, imageUrl, price }
    );
    res.redirect("/menu");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
