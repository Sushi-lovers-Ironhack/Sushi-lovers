const router = require("express").Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");
const { isUser, isRestaurant, isLoggedIn } = require("../middlewares");


// @desc    Shows the user what, if anything, is in their cart
// @route   GET /cart/view/:restaurantId
// @access  User
router.get(
  "/view/:restaurantId",
  isLoggedIn,
  isUser,
  async (req, res, next) => {
    const { restaurantId } = req.params;
    const username = req.session.currentUser;
    try {
      const foundCart = await Cart.findOne({
        userId: username,
        restaurantId: restaurantId,
        isFinished: false,
      }).populate("productsId");
      if (!foundCart) {
        res.render("cart/userCart", username);
      } else {
        let filterOfProducts = [];
        let filteredArray = [];
        let total = 0;
        for ( let product of foundCart.productsId) {
          if (!filterOfProducts.includes(String(product._id))) {
            product["quantity"] = foundCart.productsId.filter(idInCart => idInCart.equals(product._id)).length;
            filteredArray.push(product);
            filterOfProducts.push(String(product._id));
          };
          total += product.price;
        };
        res.render("cart/userCart", { filteredArray, username, total });
      }
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Shows the user the menu of a restaurant and allow to add items to a cart
// @route   GET /cart/:restaurantId
// @access  User
router.get("/:restaurantId", async (req, res, next) => {
  const { restaurantId } = req.params;
  let username = false
  let foundCart
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    const products = await Product.find({ restaurantId });
    if (req.session.currentUser) {
      const { _id } = req.session.currentUser;
      username = true
      foundCart = await Cart.findOne({
        userId: _id,
        restaurantId: restaurantId,
        isFinished: false,
      })
    }
    let drinks = [],
      starters = [],
      dishes = [],
      desserts = [],
      totalQuantity = 0;
    for (let product of products) {
      if (foundCart && foundCart.productsId.filter(idInCart => idInCart.equals(product._id)).length > 0) {
          product["quantity"] = foundCart.productsId.filter(idInCart => idInCart.equals(product._id)).length;
          totalQuantity += product.quantity;
        };
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
      username,
      totalQuantity
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Adds a product to the cart for that user and restaurant from the checkout view
// @route   GET /cart/add/:productId/checkout
// @access  User
router.get("/add/:productId/checkout", async (req, res, next) => {
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
      await Cart.create({
        userId: userId,
        restaurantId: product.restaurantId,
        productsId: [productId],
      });
    } else {
      await Cart.findByIdAndUpdate(foundCart._id, {
        $push: { productsId: productId },
      });
    }
    res.redirect(`/cart/view/${product.restaurantId}`);
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
      await Cart.create({
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

// @desc    Removes a product from the cart for that user and restaurant  from the checkout view
// @route   GET /cart/remove/:productId/checkout
// @access  User
router.get("/remove/:productId/checkout", async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.session.currentUser._id;
  try {
    const product = await Product.findById(productId);
    const foundCart = await Cart.findOne({
      userId: userId,
      restaurantId: product.restaurantId,
      isFinished: false,
    });
    foundCart.productsId.splice(foundCart.productsId.indexOf(productId), 1);
    await Cart.findByIdAndUpdate(foundCart._id, { productsId: foundCart.productsId });
    res.redirect(`/cart/view/${product.restaurantId}`);
  } catch (error) {
    next(error);
  }
});

// @desc    Removes a product from the cart for that user and restaurant
// @route   GET /cart/remove/:productId
// @access  User
router.get("/remove/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.session.currentUser._id;
  try {
    const product = await Product.findById(productId);
    const foundCart = await Cart.findOne({
      userId: userId,
      restaurantId: product.restaurantId,
      isFinished: false,
    });
    foundCart.productsId.splice(foundCart.productsId.indexOf(productId), 1);
    await Cart.findByIdAndUpdate(foundCart._id, { productsId: foundCart.productsId });
    res.redirect(`/cart/${product.restaurantId}`);
  } catch (error) {
    next(error);
  }
});

// @desc    Shows details of a product
// @route   GET /cart/detail/:productId
// @access  User
router.get("/detail/:productId", isLoggedIn, isUser, async (req, res, next) => {
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
    await Cart.findByIdAndUpdate({ _id: orderId }, { isPending: false, isSent: true });
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
