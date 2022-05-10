const express        = require('express'),
      app            = express(),
      bodyParser     = require('body-parser'),
      mongoose       = require('mongoose'),
      flash          = require('connect-flash'),
      passport       = require('passport'),
      LocalStrategy  = require('passport-local'),
      methodOverride = require('method-override'),
      moment         = require('moment'),
      Campground     = require('./models/campground'),
      Comment        = require('./models/comment'),
      User           = require('./models/user'),
      seedDB         = require('./seeds'),
      port           = process.env.PORT || 3000,
      host           = process.env.IP;

// requiring routes
const commentRoutes    = require('./routes/comments'),
      campgroundRoutes = require('./routes/campgrounds'),
      indexRoutes      = require('./routes/index');

// mongoose.connect("mongodb://localhost/yelp_camp");
const DB = "mongodb+srv://sudhanshu:sudh@yelpcamp.o1i0o.mongodb.net/yelp_camp?retryWrites=true&w=majority";
mongoose.connect(DB).then(() => {
    console.log(`Connection Successful!`);
}).catch((err) => console.log(err));

moment().format();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');
// seedDB(); // seed the database

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: "What Up!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());     // Both of these methods, serializeUser and deserializeUser are 
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// To avoid writing the fundamental route of a
// particular route we pass the route is app.use itself.

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes); 

app.listen(port, host, function() {
    console.log(`YelpCamp Server has started`);
});