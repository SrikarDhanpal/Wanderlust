const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {logincheck,isOwner,validateListing}= require("../middleware.js");
const listingController= require("../controllers/listing.js");
const multer= require("multer");

const {storage}= require("../cloundconfig.js");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(logincheck,upload.single("listing[image]"), wrapAsync(listingController.postListing));

router.get("/new", logincheck,listingController.newForm);
router.get("/:id/edit",logincheck,isOwner, wrapAsync(listingController.editForm));
router.put("/:id",validateListing,isOwner,wrapAsync(listingController.modifyListing));
router.get("/:id/show",wrapAsync(listingController.showListings));
router.get("/:id/delete",logincheck,isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;