if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Razorpay = require("razorpay");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLASSDB_URL;
main()
    .then(()=>{
        console.log("Connected to DataBase");
    }).catch((err)=>{
        console.log(err);
    })
async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.default.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*60*60
});

store.on("error", (error)=>{
    console.log("Error in Mongo Session Store", error);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// Payment gateway integration
const razorpay = new Razorpay({
    key_id : process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_CODE
});


app.get("/", (req, res)=>{
    res.render("home/hero.ejs");
});
app.get("/privacy", (req, res)=>{
    res.render("terms/privacy.ejs");
});
app.get("/terms", (req, res)=>{
    res.render("terms/terms.ejs");
});
app.use("/listings", listingRouter);
app.use("/listings/:id/book", bookingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Error handler-Middleware fn
app.use((req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});
app.use((error, req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"} = error;
    res.status(statusCode).render("error.ejs", {statusCode, message});
})


app.listen(8080, ()=>{
    console.log(`Server is listening at port 8080`);
});