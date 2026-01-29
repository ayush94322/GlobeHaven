const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};
module.exports.postSignupForm = async (req, res) => {
    try {
      let { email, username, password } = req.body;
      const newUser = await new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err)=>{
        if(err) {
          return next();
        }
        req.flash("success", "Welcome to GlobeHaven. Signup successful!");
        res.redirect("/listings");
      })
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
}
module.exports.postLoginForm = async (req, res) => {
    req.flash("success", "Login Successful!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}
  
module.exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logout successful!");
    res.redirect("/listings");
  });
}