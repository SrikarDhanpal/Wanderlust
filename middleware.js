const Listing= require("./models/listing.js")
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

const Review = require("./models/reviews.js");


module.exports.logincheck= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error","Please login to create a listing");
        return res.redirect("/login");
    }
    else{
        next();
    }
}

module.exports.savedUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    else{
        res.locals.redirectUrl="/listings";
    }
    next();
};

module.exports.isOwner= async(req,res,next)=>{
    let {id}= req.params;
    let list= await Listing.findById(id);
  if(!list.owner._id.equals(res.locals.currUser._id)){
req.flash("error","you don't have permission to edit");
return res.redirect(`/listings/${id}/show`);
}
next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        console.log(error.details);
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
 }

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        console.log(error.details);
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
 }

 module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id,reviewid}= req.params;
    let review= await Review.findById(reviewid);
  if(!review.author.equals(res.locals.currUser._id)){
req.flash("error","you are not the author of this review");
return res.redirect(`/listings/${id}/show`);
}
next();
}