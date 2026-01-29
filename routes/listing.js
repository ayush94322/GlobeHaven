const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createNewListing));

//Index Route
router.get("/", wrapAsync(listingController.index));

//Show Route
router.get("/:id", validateListing, wrapAsync(listingController.showListing)); 

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;