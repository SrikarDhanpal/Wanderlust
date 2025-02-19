const express= require("express");
const { route } = require("./listing");
const router= express.Router({mergeParams: true});
const User= require("../models/user.js")
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedUrl } = require("../middleware.js");
const userController= require("../controllers/user.js");


router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp))

router.route("/login")
.get(userController.renderLoginForm)
.post( savedUrl,passport.authenticate("local", {
        failureRedirect: "/login", failureFlash: true}),
        userController.Login);


router.get("/logout",userController.Logout);


module.exports= router;