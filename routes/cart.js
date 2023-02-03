const router = require("express").Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");

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

router.get("/add/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.session.currentUser._id;
  try {
    const product = await Product.findById(productId);
    const foundCart = await Cart.findOne({
      userId: userId,
      restaurantId: product.restaurantId,
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
