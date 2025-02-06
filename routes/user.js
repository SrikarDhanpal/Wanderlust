const express= require("express");
const { route } = require("./listing");
const router= express.Router({mergeParams: true});
const User= require("../models/user.js")
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedUrl } = require("../middleware.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
})
router.post("/signup", wrapAsync(async(req,res)=>{
    try{

        let {username,email,password} = req.body;
        let newuser= new User({email,username});
        const registereduser= await User.register(newuser,password);
        // req.flash("success","Welcome to Wanderlust!!");
        req.login(registereduser,(err)=>{
            if(err){
               return next(err);
            }
            req.flash("success","Welcome to wanderlust!");
            res.redirect("/listings");
        });
       
    }catch(e){
        req.flash("error","The username is already registered!!");
        res.redirect("/signup");
    }

}))


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",
    savedUrl,
    passport.authenticate("local", {
        failureRedirect: "/login", failureFlash: true}),
         async(req,res)=>{
    req.flash("success","Welcome to wanderlust")
    res.redirect(res.locals.redirectUrl);
})
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next();
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
})


module.exports= router;