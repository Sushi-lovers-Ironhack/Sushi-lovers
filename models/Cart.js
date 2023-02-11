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
  isOrdered: {
    type: Boolean,
    default: false
  },
  isFinished: {
    type: Boolean,
    default: false,
  },
  isPending: {
    type: Boolean,
    default: true,
  },
  isSent: {
    type: Boolean,
    default: false,
  }
},  
  {
    timestamps: true
  });

const Cart = model("Cart", cartSchema);

module.exports = Cart;
