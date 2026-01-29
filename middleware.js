const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/expressError");

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You have to Login first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    return next();
}

module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    console.log(res.locals.currUser);
    if(!res.locals.currUser._id.equals(listing.owner._id)) {
        req.flash("error", "You are not authorized to make changes to this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!res.locals.currUser._id.equals(review.author._id)) {
        req.flash("error", "You are not the author!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
