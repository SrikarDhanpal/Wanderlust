const express= require("express");
const mongoose = require('mongoose');
const path= require("path");
const methodOverride = require("method-override");
const data= require("./init/data.js");
const ejsMate= require("ejs-mate");
const app = express();
const filePath = path.join(__dirname, 'index.ejs');
const session= require("express-session");
const flash = require("connect-flash");


const listings= require("./routes/listing.js");
const reviews= require("./routes/review.js");
const { Session } = require("inspector/promises");

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));



const sessionOptions= {
    secret: "ThisIsAsecret",
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());



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




// ------------------------------------------------------------------------------------------------
//joi validation, this is server side validation. 
// This is to verify whether all the fields in the listing are according to the schema or not
//  const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errmsg = error.details.map((el)=>el.message).join(",");
//         console.log(error.details);
//         throw new ExpressError(400, errmsg);
//     }else{
//         next();
//     }
//  }

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    next();
})
 

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("*",(req,res,next)=>{
next(new ExpressError(404,"Page not found"));

});


app.use((err,req,res,next)=>{
    let {statuscode=500,message="something has occured!"}= err;
    res.render("error.ejs",{ err });
})

