const express= require("express");
const router= express.Router({mergeParams: true});
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview,logincheck,isReviewAuthor}= require("../middleware.js");


router.post("/",validateReview, logincheck,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(req.params.id);
    let newreview= new Review(req.body.review);
    newreview.author= req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save(); 
    console.log("new review saved");
    req.flash("success","new review created!!");
    res.redirect(`/listings/${id}/show`);
}));
router.delete("/:reviewid",logincheck,isReviewAuthor, wrapAsync(async(req,res)=>{
    let {id,reviewid}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","review deleted!!");
    res.redirect(`/listings/${id}/show`);
}))


module.exports= router;