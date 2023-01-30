const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  // Add whichever fields you need for your app
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required."],
      unique: true,
    },
    surname: {
      //Alberto: ésto podríamos no requerirlo y que luego el user lo añada?
      type: String,
      trim: true,
      required: [true, "Surname is required."],
      unique: true,
    },
    direction: {
      //Alberto: ésto podríamos no requerirlo y que luego el user lo añada?
      type: String,
      trim: true,
      required: [true, "Direction is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      //Alberto: ésto podríamos no requerirlo y que luego el user lo añada?
      type: Number,
      trim: true,
      required: [true, "Phone number is required."],
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: [true, "Password is required."],
    },
    paymentCard: {
      //Alberto: ésto podríamos no requerirlo y que luego el user lo añada?
      type: Number,
      required: [true, "Payment card is required."],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
