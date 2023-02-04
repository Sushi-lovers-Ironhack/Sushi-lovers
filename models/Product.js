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
      type: String,
      default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftheplanetd.com%2Ftraditional-japanese-food%2F&psig=AOvVaw3HWesUj4aEiQYs96KfiRhd&ust=1675601817276000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCJC3var1-_wCFQAAAAAdAAAAABAE",
    },
    price: {
      type: Number,
      required: [true, "Price is required"]
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