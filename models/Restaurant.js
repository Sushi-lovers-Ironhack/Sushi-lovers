const { Schema, model } = require("mongoose");

const restaurantSchema = new Schema(
  // Add whichever fields you need for your app
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: [true, "Password is required."],
    },
    direction: {
      type: String,
      required: [true, "Direction is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    imageUrl: {
      type: String,
      default:
        "https://scontent.fbcn3-1.fna.fbcdn.net/v/t39.30808-6/243200278_260965582698292_6813909715328889748_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=LPQr9b8_V9gAX8-sLtB&_nc_ht=scontent.fbcn3-1.fna&oh=00_AfCb2oIdnDxe5YX8vG6MdTC8dmuuBJ0GkvXGRr7SE9q98Q&oe=63F3D21D",
    },
    logoUrl: {
      type: String,
      default:
        "https://img.freepik.com/vector-gratis/ejemplo-lindo-icono-vector-historieta-salmon-sushi-concepto-icono-caracter-comida-estilo-dibujos-animados-plana_138676-2590.jpg",
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant = model("Restaurant", restaurantSchema);

module.exports = Restaurant;
