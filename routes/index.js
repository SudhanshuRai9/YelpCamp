const express  = require('express'),
      router   = express.Router(),
      passport = require('passport'),
      User     = require('../models/user');

// ROOT ROUTE
router.get("/", function(req, res) {
    res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========

// show register form
router.get("/register", (req, res) => {
    res.render("register");
})

// handling sign up logic
router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            // console.log(err);
            req.flash("error", err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    })
})

// LOGIN ROUTES

// show login form
router.get("/login", (req, res) => {
    res.render("login");
});

// Login logic handling
router.post("/login", passport.authenticate('local', 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {
});

//logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
})

module.exports = router;