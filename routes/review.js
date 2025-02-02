const express= require("express");
const router= express.Router({mergeParams: true});
const { reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        console.log(error.details);
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
 }

router.post("/",validateReview, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(req.params.id);
    let newreview= new Review(req.body.review);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save(); 
    console.log("new review saved");
    req.flash("success","new review created!!");
    res.redirect(`/listings/${id}/show`);
}));
router.delete("/:reviewid", wrapAsync(async(req,res)=>{
    let {id,reviewid}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","review deleted!!");
    res.redirect(`/listings/${id}/show`);
}))


module.exports= router;