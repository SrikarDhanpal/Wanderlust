const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        console.log(error.details);
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
 }

router.get("/new", (req,res)=>{
    res.render("listings/new.ejs");
})
router.post("/",validateListing, wrapAsync(async (req, res,next) => {
    // let {title,description,image,price,location}= req.body;
   


    
    let newListing = req.body.listing;
    newListing = {...newListing, image:{url: newListing.image, filename: "your choice"}};
    const newListing1 = new Listing(newListing);
    await newListing1.save();
    res.redirect("/listings");

    //    console.log(req.body);
  
    
   
  }));
router.get("/:id/edit", wrapAsync(async(req,res)=>{
    
    let {id}= req.params;
    let doc= await Listing.findById(id);
    res.render("listings/edit", {doc});
}))

router.put("/:id",validateListing,wrapAsync(async(req, res) => {
    let { id } = req.params;
    let newListing = req.body.listing;
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data");
    }
    newListing = {...newListing, image:{url: newListing.image, filename: "your choice"}};
  
    await Listing.findByIdAndUpdate(id, newListing);
    res.redirect(`/listings/${id}/show`);
    // res.send("editing")
  }));
router.get("/", wrapAsync(async(req,res)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}))
router.get("/:id/show",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let doc= await Listing.findById(id).populate("reviews");
    console.log(doc);
    res.render("listings/show.ejs", {doc});
// res.send("showing each list");
}))
router.get("/:id/delete",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let doc= await Listing.findByIdAndDelete(id);
    console.log(doc);
    res.redirect("/listings");
}))

module.exports = router;