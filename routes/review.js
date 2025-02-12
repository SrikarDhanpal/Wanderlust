const express= require("express");
const router= express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview,logincheck,isReviewAuthor}= require("../middleware.js");
const reviewController= require("../controllers/review.js");

router.post("/",validateReview, logincheck,wrapAsync(reviewController.createReview));
router.delete("/:reviewid",logincheck,isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports= router;