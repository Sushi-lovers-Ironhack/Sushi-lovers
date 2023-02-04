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
  let { name, category, description, imageUrl, price } = req.body;
  if (imageUrl == "") {
    imageUrl = "data:image/jpeg;base64,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";
  };
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
