const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  productsId: {
    type: [Schema.Types.ObjectId],
    ref: "Product",
  },
  isFinished: {
    type: Boolean,
    default: false,
  },
});

const Cart = model("Cart", cartSchema);

module.exports = Cart;
