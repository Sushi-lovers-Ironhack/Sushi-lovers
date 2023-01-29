const { Schema, model } = require('mongoose');
 
const restaurantSchema = new Schema(
  // Add whichever fields you need for your app
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: [true, 'Password is required.']
    },
    direction: {
      type: String,
      required: [true, 'Direction is required']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    imageUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
 
const Restaurant = model('Restaurant', restaurantSchema);

module.exports = Restaurant;