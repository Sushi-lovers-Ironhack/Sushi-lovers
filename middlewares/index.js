//This middleware checks if any seasson is created
const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};
//this middleware checks if the role of the seasson created is "User" FyI:check User loggin
const isUser = (req, res, next) => {
  if (req.session.role === "user") {
    next();
  } else {
    res.redirect("/auth/login");
  }
};
//this middleware checks if the role of the seasson created is "Restaurant" FyI:check Restaurant loggin
const isRestaurant = (req, res, next) => {
  if (req.session.role === "restaurant") {
    next();
  } else {
    res.redirect("/auth/login");
  }
};
//the idea is create a "doble check" for more security; check seasson and role user
//to prevent one logged User can access to Restaurant routes.

module.exports = { isLoggedIn, isUser, isRestaurant };
