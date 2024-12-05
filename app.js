const express= require("express");
const mongoose = require('mongoose');
const path= require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const data= require("./init/data.js");
const ejsMate= require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const app = express();
const filePath = path.join(__dirname, 'index.ejs');
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const reviews = require("./models/reviews.js");

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));


// connecting to mongo database
main()
.then(()=>{
    console.log("connection successfull");
})
.catch((err)=>{
    console.log(err);
    
});

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


app.listen(1975,()=>{
    console.log("iam listening");
});
app.get("/",(req,res)=>{
    res.send("working properly");
}) 
// ---------------------------------------------------------------------------------------------------
// app.get("/testlisting", async(req,res)=>{
//     let sample = new Listing({
//         title: "ghost",
//         description: "Its brand new",
//         price: 100000000,
//         location: "yamnampet",
//         country: "India"
//     });
//      await sample.save();
//      console.log("sample saved");
//      res.send("succefully saved");
// })
// Listing.insertMany(data).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
// let data= new Listing({
//     title: "phantom",
//     description: "Its old",
//     price: 1000000001,
//     location: "nizamabad",
//     country: "Uk"
// });
// data.save().then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});

// console.log(data[0]);

// ------------------------------------------------------------------------------------------------
//joi validation, this is server side validation. 
// This is to verify whether all the fields in the listing are according to the schema or not
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



app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
})
app.post("/listings",validateListing, wrapAsync(async (req, res,next) => {
    // let {title,description,image,price,location}= req.body;
   


    
    let newListing = req.body.listing;
    newListing = {...newListing, image:{url: newListing.image, filename: "your choice"}};
    const newListing1 = new Listing(newListing);
    await newListing1.save();
    res.redirect("/listings");

    //    console.log(req.body);
  
    
   
  }));
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    
    let {id}= req.params;
    let doc= await Listing.findById(id);
    res.render("listings/edit", {doc});
}))

app.put("/listings/:id",validateListing,wrapAsync(async(req, res) => {
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
app.get("/listings", wrapAsync(async(req,res)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}))
app.get("/listings/:id/show",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let doc= await Listing.findById(id).populate("reviews");
    console.log(doc);
    res.render("listings/show.ejs", {doc});
// res.send("showing each list");
}))
app.get("/listings/:id/delete",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let doc= await Listing.findByIdAndDelete(id);
    console.log(doc);
    res.redirect("/listings");
}))
// creating reviews
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newreview= new Review(req.body.review);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save(); 
    console.log("new review saved");
    res.redirect("/listings");
}));
app.delete("/listings/:id/reviews/:reviewid", wrapAsync(async(req,res)=>{
    let {id,reviewid}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}/show`);
}))
app.all("*",(req,res,next)=>{
next(new ExpressError(404,"Page not found"));

});


app.use((err,req,res,next)=>{
    let {statuscode=500,message="something has occured!"}= err;
    res.render("error.ejs",{ err });
})

