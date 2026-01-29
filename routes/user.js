const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const router = express.Router();
const userController = require("../controller/user.js");

// signup
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.postSignupForm));

// login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.postLoginForm),
  );

// logout
router.get("/logout", userController.getLogout);

module.exports = router;
