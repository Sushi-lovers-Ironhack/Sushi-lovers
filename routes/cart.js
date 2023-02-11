const router = require("express").Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");
const { isUser, isLoggedIn } = require("../middlewares");

// @desc    Shows the user what, if anything, is in their cart
// @route   GET /cart/view/:restaurantId
// @access  User
router.get("/view/:restaurantId", async (req, res, next) => {
  const { restaurantId } = req.params;
  const username = req.session.currentUser._id;
  try {
    const foundCart = await Cart.findOne({
      userId: username,
      restaurantId: restaurantId,
      isFinished: false,
    }).populate("productsId");

    if (!foundCart) {
      res.render("cart/userCart");
    } else {
      let total = 0
      foundCart.productsId.forEach(product => {
        total += product.price;
      });
      res.render("cart/userCart", {foundCart, username, total});
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
  const username = req.session.currentUser;
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
      username
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

// @desc    Shows details of a product
// @route   GET /cart/detail/:productId
// @access  User
router.get("/detail/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const username = req.session.currentUser;
  try {
    const productDB = await Product.findById({ _id: productId });
    res.render("cart/productDetail", { username, productDB });
  } catch (error) {
    next(error);
  }
});

// @desc    Accepts order and redirects to restaurant home view
// @route   GET /cart/order/:orderId/accept
// @access  User
router.get("/order/:orderId/accept", isLoggedIn, isRestaurant, async (req, res, next) => {
  const { orderId } = req.params;
  try {
    await Cart.findByIdAndUpdate({ _id: orderId }, { isPending: false })
    res.redirect("/restaurant");
  } catch (error) {
    next(error);
  }
});

// @desc    Deny order and redirects to restaurant home view
// @route   GET /cart/order/:orderId/deny
// @access  User
router.get("/order/:orderId/deny", isLoggedIn, isRestaurant, async (req, res, next) => {
  const { orderId } = req.params;
  try {
    await Cart.findByIdAndUpdate({ _id: orderId }, { isPending: false, isFinished: true })
    res.redirect("/restaurant");
  } catch (error) {
    next(error);
  }
});

// @desc    Confirms order has been sent by the restaurant
// @route   GET /cart/order/:orderId/sent
// @access  User
router.get("/order/:orderId/sent", isLoggedIn, isRestaurant, async (req, res, next) => {
  const { orderId } = req.params;
  try {
    await Cart.findByIdAndUpdate({ _id: orderId }, { isPending: false, isFinished: true, isSent: true });
    res.redirect("/restaurant");
  } catch (error) {
    next(error);
  }
});

// @desc    Shows details of an order to accept or deny it
// @route   GET /cart/order/:orderId
// @access  User
router.get("/order/:orderId", isLoggedIn, isRestaurant, async (req, res, next) => {
  const { orderId } = req.params;
  const name = req.session.currentUser;
  try {
    const orderDB = await Cart.findById({ _id: orderId }).populate('userId').populate('productsId');
    res.render("cart/orderDetail", { name, orderDB });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
