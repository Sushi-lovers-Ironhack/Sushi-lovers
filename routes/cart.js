const router = require("express").Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");

// @desc    Shows the user what, if anything, is in their cart
// @route   GET /cart/view/:restaurantId
// @access  User
router.get("/view/:restaurantId", async (req, res, next) => {
  const { restaurantId } = req.params;
  const userId = req.session.currentUser._id;
  try {
    const foundCart = await Cart.findOne({
      userId: userId,
      restaurantId: restaurantId,
      isFinished: false,
    }).populate("productsId");
    if (!foundCart) {
      res.render("cart/userCart");
    } else {
      res.render("cart/userCart", foundCart);
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Shows the user the menu of a restaurant and allow to add items to a cart
// @route   GET /cart/:restaurantId
// @access  User
router.get("/:restaurantId", async (req, res, next) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    const products = await Product.find({ restaurantId });
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
    res.render("cart/restaurantMenu", {
      restaurant,
      drinks,
      starters,
      dishes,
      desserts,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Adds a product to the cart for that user and restaurant
// @route   GET /cart/add/:productId
// @access  User
router.get("/add/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.session.currentUser._id;
  try {
    const product = await Product.findById(productId);
    const foundCart = await Cart.findOne({
      userId: userId,
      restaurantId: product.restaurantId,
      isFinished: false,
    });
    if (!foundCart) {
      const newCart = await Cart.create({
        userId: userId,
        restaurantId: product.restaurantId,
        productsId: [productId],
      });
    } else {
      await Cart.findByIdAndUpdate(foundCart._id, {
        $push: { productsId: productId },
      });
    }
    res.redirect(`/cart/${product.restaurantId}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
