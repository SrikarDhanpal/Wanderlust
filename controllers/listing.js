const Listing= require("../models/listing.js");
<<<<<<< HEAD
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({accessToken: mapToken});
=======

>>>>>>> dc647b9558383dc48548ef22b6786659fb2eea5b

module.exports.showListings=async(req,res)=>{
    let {id}= req.params;
    let doc= await Listing.findById(id).populate({
        path: "reviews",
         populate:{
        path: "author"
         }
    }).populate("owner");
<<<<<<< HEAD
    console.log(doc);
=======
    // console.log(doc);
>>>>>>> dc647b9558383dc48548ef22b6786659fb2eea5b
    if(!doc){
        req.flash("error","The Listing you want to access does not exist!!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {doc});
// res.send("showing each list");
}

module.exports.index=async(req,res)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.deleteListing=async(req,res)=>{
    let {id}= req.params;
    let doc= await Listing.findByIdAndDelete(id);
    console.log(doc);
    req.flash("success"," listing deleted!!");
    res.redirect("/listings");
}

module.exports.newForm=(req,res)=>{
    
    res.render("listings/new.ejs");
}

module.exports.postListing=async (req, res,next) => {
<<<<<<< HEAD
        let response= await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send();

       let url= req.file.path;
       let filename= req.file.filename;
       console.log(url,"..",filename);

    
    let newListing = req.body.listing;
    newListing.image= {url,filename}

    const newListing1 = new Listing(newListing);
    newListing1.owner=req.user._id;
    newListing1.geometry= response.body.features[0].geometry;
    let savedListing=await newListing1.save();
    console.log(savedListing);
=======
   let url= req.file.path;
   let filename= req.file.filename;
   console.log(url,"..",filename);
   


    
    let newListing = req.body.listing;
   newListing.image= {url,filename}
    const newListing1 = new Listing(newListing);
    newListing1.owner=req.user._id;
    await newListing1.save();
>>>>>>> dc647b9558383dc48548ef22b6786659fb2eea5b
    req.flash("success","new listing created!!");
    res.redirect("/listings");

    //    console.log(req.body);
  
    
   
  }


 module.exports.editForm = async(req,res)=>{
      
      let {id}= req.params;
      let doc= await Listing.findById(id);
      if(!doc){
          req.flash("error","The Listing you want to access does not exist!!");
          res.redirect("/listings");
      }
<<<<<<< HEAD
      let OriginalUrl= doc.image.url;
      OriginalUrl=OriginalUrl.replace("/upload", "/upload/h_300,w_250");
      res.render("listings/edit", {doc, OriginalUrl});
  }
  module.exports.modifyListing=async(req, res) => {
      let { id } = req.params;
      let newListing= await Listing.findByIdAndUpdate(id,req.body.listing);
    
     if(typeof req.file != "undefined"){

         let url= req.file.path;
         let filename= req.file.filename;
         
         
         newListing.image={url,filename};
         await newListing.save();
        };
=======
      res.render("listings/edit", {doc});
  }

  module.exports.modifyListing=async(req, res) => {
    let { id } = req.params;
    let newListing = req.body.listing;
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data");
    }
    newListing = {...newListing, image:{url: newListing.image, filename: "your choice"}};
  
await Listing.findByIdAndUpdate(id, newListing);
>>>>>>> dc647b9558383dc48548ef22b6786659fb2eea5b
      req.flash("success","listing modified!!");
    res.redirect(`/listings/${id}/show`);
    // res.send("editing")
  }