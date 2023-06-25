const express    = require('express'),
      fs         = require('fs'),
      router     = express.Router(),
      moment     = require('moment'),
      Campground = require('../models/campground'),
      middleware = require('../middleware/index.js'),
      upload     = require('../utils/multer'),
      cloudinary = require('../utils/cloudinary');

moment().format();
// INDEX - show all campgrounds

router.get("/", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// CREATE - add new campground to DB

router.post("/", middleware.isLoggedIn, upload.single('image'), async function(req, res) {
    const { name, price, desc } = req.body;
    const file = req.file;
    if(!name || !price || !file || !desc) {
        fs.unlinkSync(file.path);
        res.status(400).json({ error: 'All fields are mandatory!' });
        return;
    }

    let validFileType = false;
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        validFileType = true;
    }
    const author = {
        id: req.user._id,
        username: req.user.username
    };

    try {
        if(validFileType) {
            const uploadRes = await cloudinary.uploader.upload(file.path, {
                folder: 'yelpcamp',
            })

            if(uploadRes) {
                const newCampground = new Campground({
                    name, 
                    price,
                    image: uploadRes.secure_url,
                    image_id: uploadRes.public_id,
                    image_name: uploadRes.original_filename + '.' + uploadRes.format,
                    desc,
                    author
                })

                // Create a new campground and save it to db
                try {
                    const newlyCreated = await Campground.create(newCampground);
                    fs.unlinkSync(file.path);
                    res.status(201).send(newlyCreated);
                } catch (error) {
                    console.log("Mongo error ->", err);
                    res.status(500).json({ error: 'Database error' });
                }
                
            } else {
                res.status(500).json({ error: 'Could not be uploaded on cloudinary' });
            }
        } else {
            fs.unlinkSync(file.path);
            res.status(400).json({ error: 'Invalid File Type!' });
        }
    }
    catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});
  

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});


// SHOW - shows more info about one campground

router.get("/:id", (req, res) => {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// ===========
// EDIT ROUTES
// ===========

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwner, (req, res) => {
    // is user logged in at all
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground})
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwner, upload.single('updated_image'), async (req, res) => {
    const { updated_name, updated_price, updated_desc } = req.body;
    const file = req.file;
    if(!updated_name || !updated_price || !updated_desc) {
        res.status(400).json({ error: 'All fields are mandatory!' });
        return;
    }

    const campgroundId = req.params.id;
  
    try {
        // Find the existing campground by ID
        const existingCampground = await Campground.findById(campgroundId);
    
        // Check if a new image file was uploaded
        if (file) {
            // Check the validity of the file type
            const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validFileTypes.includes(file.mimetype)) {
                // Invalid file type, delete the temporary file
                fs.unlinkSync(file.path);
                return res.status(400).json({ error: 'Invalid file type' });
            }
    
            // Upload the new image to Cloudinary
            const uploadRes = await cloudinary.uploader.upload(file.path, {
                folder: 'yelpcamp',
            });
    
            // Delete the previous image from Cloudinary using the image_id
            await deleteFileByImageId(existingCampground.image_id);
    
            // Update the campground with the new image details
            existingCampground.image = uploadRes.secure_url;
            existingCampground.image_id = uploadRes.public_id;
            existingCampground.image_name = uploadRes.original_filename + '.' + uploadRes.format;
    
            // Delete the temporary file after successful upload
            fs.unlinkSync(file.path);
        }
  
        // Update other fields of the campground
        existingCampground.name = updated_name;
        existingCampground.price = updated_price;
        existingCampground.desc = updated_desc;
    
        // Save the updated campground
        const updatedCampground = await existingCampground.save();
  
        res.status(200).send(updatedCampground);
    } catch (error) {
        res.status(400).json({ error: 'Error updating campground' });
    }
});

// =============
// DELETE ROUTES
// =============

// DESTROY Campground Route
router.delete("/:id", middleware.checkCampgroundOwner, async (req, res) => {
    try {
        const foundCampground = await Campground.findById(req.params.id);
        const imageId = foundCampground.image_id;
        await deleteFileByImageId(imageId);
        Campground.findByIdAndRemove(req.params.id, (err) => {
            if(err) {
                res.redirect("/campgrounds");
            } else {
                req.flash("success", "Campground deleted");
                res.redirect("/campgrounds");
            }
        });    
    } catch (error) {
        console.error(error);
        res.redirect('/campgrounds');
    }
});

async function deleteFileByImageId(imageId) {
    try {
        // Delete the file using the public ID
        await cloudinary.uploader.destroy(imageId);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}

module.exports = router;