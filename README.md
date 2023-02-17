# App name

## Description

This is a project developed by Alberto Valenzuela and Gerard Guasch as the project for the second module at Ironhack. The purpose of the application is to make an application to connect japanese restaurants from your city with users. This app can be used by both end users or restaurants.

---

## Instructions

When cloning the project, change the <code>sample.env</code> for an <code>.env</code> with the values you consider:

```js
PORT = 3000;
MONGO_URL = "mongodb://localhost:27017/app-name";
SESSION_SECRET = "SecretOfYourOwnChoosing";
NODE_ENV = "development";
```

Then, run:

```bash
npm install
```

To start the project run:

```bash
npm run start
```

To work on the project and have it listen for changes:

```bash
npm run dev
```

---

## Wireframes

[Excalidraw](https://excalidraw.com/#room=f36146d37f1d807dd5e6,OdZmpUCeS2YXfeGzAnWxlQ)

---

## User stories (MVP)

What can the user do with the app?

- User can sign up and create and account
- User can login
- User can log out
- User can delete own account
- User can edit own account
- User can see all restaurants
- User has access to a search field
- User can see all products in a restaurant
- User can add products to a cart
- User can confirm the contents of the order (add/remove products)
- User can order the products on the cart
- User can see the update the status of the order
- User recive and accept/deny msg about own order
- User can confirm the product has been received
- User can see previous orders
- User can reorder from past orders

What can the restaurant do with the app?

- Restaurant can sign up and create and account
- Restaurant can login
- Restaurant can log out
- Restaurant can delete own account
- Restaurant can edit own account
- Restaurant can create products
- Restaurant can edit products
- Restaurant can delete products
- Restaurant can open/close of the users to be seen
- Restaurant can receive orders from the users
- Restaurant can see the details of the order
- Restaurant can accept/deny the order
- Resturant send and accept/deny msg to the User
- Restaurant can set an accepted order as sent

## User stories (Backlog)

- All completed



---

## Models

User:

```js
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required."],
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
  },
  {
    timestamps: true,
  }
);
```

Cart:

```js
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
```

Restaurant:

```js
const restaurantSchema = new Schema(
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
```

Product:

```js
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
```

---

## Routes

| Name      | Method | Endpoint     | Protected | Req.body                      | Redirects        |
| --------- | ------ | ------------ | --------- | ----------------------------- | ---------------- |
| Home      | GET    | /       | No        |                               |                  |
| Login     | GET    | /auth/login  | No        |                               |                  |
| Login     | POST   | /auth/login  | No        | { email, password }           | /home & /restaurant|
| Logout     | GET    | /auth/logout  | Yes, user or restaurant        |                               | /auth/login                |
| Signup    | GET    | /auth/signup | No        |                               |                  |
| Signup    | POST   | /auth/signup | No        | { username, username, direction, phoneNumber, paymentCard, email, password1, password2 } | /user/profile      |
| User profile    | GET    | /user/profile | Yes, user        |                               |                  |
| Edit User profile    | GET    | /user/profile/edit | Yes, user         |                               |                  |
| Edit User profile    | POST    | /user/profile/edit | No        | { username, username, direction, phoneNumber, paymentCard, email, password1, password2 }  | /user/profile   |
| Delete User profile    | GET    | /user/profile/delete | Yes, user         |                               | /auth/login          |
| Signup restaurant      | GET    | /auth/restaurant/signup  | No        |               |                  |
| Signup restaurant      | POST    | /auth/restaurant/signup  | No        | { name, direction, phoneNumber, email, password1, password2, description }              | /restaurant/profile        |
| Restaurant profile     | GET    | /restaurant/profile  | Yes, restaurant       |               |                  |
| Edit Restaurant profile     | GET    | /restaurant/profile/edit  | Yes, restaurant       |               |                  |
| Edit Restaurant profile     | POST    | /restaurant/profile/edit  |       |  { name, direction, phoneNumber, email, password1, password2, description, imgUrl }             | /restaurant/profile       |
| Delete Restaurant profile     | GET    | /restaurant/profile/delete  | Yes, restaurant       |               | /auth/login              |
| Cart Status      | GET    | /cart/status        | Yes, user        |                               |                  |
| Cart ordered     | GET    | /cart/setcartordered/:cartId        | Yes, user        |                               |  /cart/status     |
| Cart finished      | GET    | /cart/finished/:cartId        | Yes, user        |                               |   /               |
| Cart view      | GET    | /cart/view/:restaurantId       | No        |                               |                  |
| Cart menu      | GET    | /cart/:restaurantId        | No        |                               |                  |
| Cart add checkout     | GET    | /cart/add/:productId/checkout        | Yes, user       |                               |  /cart/view/${product.restaurantId}                |
| Cart add      | GET    | /cart/add/:productId        | Yes, user        |                               | /cart/${product.restaurantId}                 |
| Cart remove checkout      | GET    | /cart/remove/:productId/checkout        | Yes, user        |                               |  /cart/view/${product.restaurantId}                |
| Cart remove     | GET    | /cart/remove/:productId        | Yes, user        |                               |  /cart/view/${product.restaurantId}                |
| Cart prod detail      | GET    | /cart/detail/:productId        | No        |                               |                  |
| Cart checkout view      | GET    | /cart/checkout/:cartId        |  Yes, user        |                               |                  |
| Cart accept order     | GET    | /cart/order/:orderId/accept        | Yes, restaurant        |                              |  /restaurant                |
| Cart deny order     | GET    | /cart/order/:orderId/deny       | Yes, restaurant        |                               |  /restaurant                |
| Cart order sent      | GET    | /cart/order/:orderId/sent        | Yes, restaurant        |                               |  /restaurant                |
| Cart order detail      | GET    | /cart/order/:orderId        | Yes, restaurant        |                               |                  |
| User search      | GET    | /search        | No        |                               |                  |
| User search      | POST    | /search        | No        |    { search }                        |                  |
| Rest menu      | GET    | /menu        | Yes, restaurant       |                               |                  |
| Rest menu add prod      | GET    | /menu/add        | Yes, restaurant       |                               |                  |
| Rest menu add prod      | POST    | /menu/add        | Yes, restaurant        |  { name, category, description, imageUrl, price }                             |  /menu                |
| Rest menu remove prod      | GET    | /menu/:productId/delete        | Yes, restaurant        |                               |  /menu                |
| Rest menu edit view      | GET    | /menu/:productId        | Yes, restaurant        |                               |                  |
| Rest menu create view     | GET    | /menu/productId        | Yes, restaurant        |                               |                  |
| Rest orders view      | GET    | /restaurant        | Yes, restaurant      |                               |                  |
| Rest open/close     | GET    | /restaurant/status       | Yes, restaurant        |                               |                  |
| User see past orders      | GET    | /user/pastOrders        | Yes, user        |                               |                  |
| User reorder      | GET    | /user/pastOrder/:orderId/reorder       | Yes, user        |                               |                  |
| User past order detail      | GET    | /user/pastOrder/:orderId        | Yes, user        |                               |                  |



---

## Useful links

- [Github Repo](https://github.com/Sushi-lovers-Ironhack/Sushi-lovers)
- [Trello kanban](https://trello.com/b/hgDJiNI1/shushilovers)
- [Deployed version](https://sushilovers-app.fly.dev/)
- [Presentation slides](https://slides.com/albertovalenzuelamunoz/deck)
