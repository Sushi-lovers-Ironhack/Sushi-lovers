const { Schema, model, Mongoose } = require('mongoose');
 
const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required.'],
    },
    category: {
      type: String,
      enum: ["Drinks", "Starters", "Dishes", "Desserts"],
      required: [true, "Category is required"]
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String
    },
    price: {
      type: Number,
      required: [true, "Category is required"]
    },
    restaurantId: {
      type: Schema.Types.ObjectId, ref: 'Restaurant'
    }
  },
  {
    timestamps: true
  }
);
 
const Product = model('Product', productSchema);

module.exports = Product;