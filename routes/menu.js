const router = require("express").Router();
const Product = require("../models/Product");

// @desc    Menu view for the restaurant
// @route   GET /menu/
// @access  Restaurant
router.get('/', async (req, res, next) => {
    const { name, _id } =req.session.currentUser;
    try {
      const products = await Product.find({ restaurantId: _id });
      let Drinks = [], Starters = [], Dishes = [], Desserts = [];
      for (let product of products) {
        if(product.category == "Drinks") {
          Drinks.push(product);
        };
        if(product.category == "Starters") { ç
          Starters.push(product);
        };
        if(product.category == "Dishes") {
          Dishes.push(product);
        };
        if(product.category == "Desserts") {
          Desserts.push(product);
        };
      };
      res.render('menu/menu', {name, Drinks, Starters, Dishes, Desserts});
    } catch (error) {
      next(error);
    }
  });

// @desc    Renders view to create a new product
// @route   GET /menu/add
// @access  Restaurant
router.get('/add', (req, res, next) => {
  const user = req.session.currentUser;
  res.render('menu/menuAdd', user);
});

// @desc    Gets data from from and creates a new Product document
// @route   POST /menu/add
// @access  Restaurant
router.post('/add', async (req, res, next) => {
  const restaurantId = req.session.currentUser._id;
  const { name, category, description, imageUrl, price } = req.body;
  try {
    await Product.create({ name, category, description, imageUrl, price, restaurantId });
    res.redirect('/menu');
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a product
// @route   GET /menu/:productId/delete
// @access  Restaurant
router.get('/:productId/delete', async (req, res, next) => {
  const { productId } = req.params;
  try {
    await Product.findByIdAndDelete({ _id: productId });
    res.redirect('/menu');
  } catch (error) {
    next(error);
  }
});

// @desc    Send data from the product to edit
// @route   GET /menu/:productId
// @access  Restaurant
router.get('/:productId', async (req, res, next) => {
  const name = req.session.currentUser.name;
  const { productId } = req.params;
  try {
    const productDB = await Product.findById({ _id: productId });
    res.render('menu/menuEdit', {name, productDB});
  } catch (error) {
    next(error);
  }
});

// @desc    Gets edited data and updates on the database
// @route   POST /menu/productId
// @access  Restaurant
router.post('/:productId', async (req, res, next) => {
  const { productId } = req.params;
  const { name, category, description, imageUrl, price } = req.body;
  try {
    await Product.findByIdAndUpdate({ _id: productId }, { name, category, description, imageUrl, price });
    res.redirect('/menu');
  } catch (error) {
    next(error);
  }
});

module.exports = router;