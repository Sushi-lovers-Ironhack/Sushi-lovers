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

Substitute this image with an image of your own app wireframes or designs

![](docs/wireframes.png)

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

What can the restaurant do with the app?

- Restaurant can sign up and create and account
- Restaurant can login
- Restaurant can log out
- Restaurant can delete own account
- Restaurant can edit own account
- Restaurant can create products
- Restaurant can edit products
- Restaurant can delete products

## User stories (Backlog)

- User can confirm the contents of the order (add/remove products)
- User can order the products on the cart
- User can see the update the status of the order
- User recive and accept/deny msg about own order
- User can confirm the product has been received
- User can see previous orders
- User can reorder from past orders

- Restaurant can open/close of the users to be seen
- Restaurant can receive orders from the users
- Restaurant can see the details of the order
- Restaurant can accept/deny the order
- Resturant send and accept/deny msg to the User
- Restaurant can set an accepted order as sent

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

---

## Routes

| Name      | Method | Endpoint     | Protected | Req.body                      | Redirects        |
| --------- | ------ | ------------ | --------- | ----------------------------- | ---------------- |
| Home      | GET    | /home        | No        |                               |                  |
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


---

## Useful links

- [Github Repo]()
- [Trello kanban]()
- [Deployed version]()
- [Presentation slides](https://www.slides.com)
