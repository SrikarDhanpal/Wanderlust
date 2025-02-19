const User = require("../models/user.js");


module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newuser= new User({email,username});
        const registereduser= await User.register(newuser,password);
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

}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.Login=async(req,res)=>{
    req.flash("success","Welcome to wanderlust")
    res.redirect(res.locals.redirectUrl);
}
module.exports.Logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next();
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}