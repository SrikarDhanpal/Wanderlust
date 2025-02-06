const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {logincheck,isOwner,validateListing}= require("../middleware.js");



router.get("/new", logincheck,(req,res)=>{
    
    res.render("listings/new.ejs");
})
router.post("/",validateListing,logincheck, wrapAsync(async (req, res,next) => {
    // let {title,description,image,price,location}= req.body;
   


    
    let newListing = req.body.listing;
    newListing = {...newListing, image:{url: newListing.image, filename: "your choice"}};
    const newListing1 = new Listing(newListing);
    newListing1.owner=req.user._id;
    await newListing1.save();
    req.flash("success","new listing created!!");
    res.redirect("/listings");

    //    console.log(req.body);
  
    
   
  }));
router.get("/:id/edit",logincheck,isOwner, wrapAsync(async(req,res)=>{
    
    let {id}= req.params;
    let doc= await Listing.findById(id);
    if(!doc){
        req.flash("error","The Listing you want to access does not exist!!");
        res.redirect("/listings");
    }
    res.render("listings/edit", {doc});
}))

router.put("/:id",validateListing,isOwner,wrapAsync(async(req, res) => {
    let { id } = req.params;
    let newListing = req.body.listing;
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data");
    }
    newListing = {...newListing, image:{url: newListing.image, filename: "your choice"}};
  
await Listing.findByIdAndUpdate(id, newListing);
      req.flash("success","listing modified!!");
    res.redirect(`/listings/${id}/show`);
    // res.send("editing")
  }));
router.get("/", wrapAsync(async(req,res)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}))
router.get("/:id/show",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let doc= await Listing.findById(id).populate({
        path: "reviews",
         populate:{
        path: "author"
         }
    }).populate("owner");
    // console.log(doc);
    if(!doc){
        req.flash("error","The Listing you want to access does not exist!!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {doc});
// res.send("showing each list");
}))
router.get("/:id/delete",logincheck,isOwner,wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let doc= await Listing.findByIdAndDelete(id);
    console.log(doc);
    req.flash("success"," listing deleted!!");
    res.redirect("/listings");
}))

module.exports = router;