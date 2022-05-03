const mongoose   = require("mongoose"),
      Campground = require("./models/campground"),
      Comment    = require("./models/comment");

const data = [
    {
        name: "Cloud's Rest", 
        image: "https://images.unsplash.com/photo-1571687949921-1306bfb24b72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum vel aliquid vitae, nulla impedit explicabo earum facere corrupti nobis perspiciatis ducimus! Ipsum, voluptate! Soluta nesciunt ducimus praesentium sed quam aliquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum vel aliquid vitae, nulla impedit explicabo earum facere corrupti nobis perspiciatis ducimus! Ipsum, voluptate! Soluta nesciunt ducimus praesentium sed quam aliquam?"
    },
    {
        name: "Sun's Blush", 
        image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum vel aliquid vitae, nulla impedit explicabo earum facere corrupti nobis perspiciatis ducimus! Ipsum, voluptate! Soluta nesciunt ducimus praesentium sed quam aliquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum vel aliquid vitae, nulla impedit explicabo earum facere corrupti nobis perspiciatis ducimus! Ipsum, voluptate! Soluta nesciunt ducimus praesentium sed quam aliquam?" 
    },
    {
        name: "Amidst Nowhere", 
        image: "https://images.unsplash.com/photo-1601134917279-ef70a0a90f18?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum vel aliquid vitae, nulla impedit explicabo earum facere corrupti nobis perspiciatis ducimus! Ipsum, voluptate! Soluta nesciunt ducimus praesentium sed quam aliquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum vel aliquid vitae, nulla impedit explicabo earum facere corrupti nobis perspiciatis ducimus! Ipsum, voluptate! Soluta nesciunt ducimus praesentium sed quam aliquam?" 
    }
]

function seedDB() {
    Campground.deleteMany({}, (err) => {
        // if(err) {
        //     console.log(err);
        // }
        // console.log("Removed Campgrounds!");
        // // add a few campgrounds
        // data.forEach((seed) => {
        //     Campground.create(seed, (err, campground) => {
        //         if(err) {
        //             console.log(err);
        //         } else {
        //             console.log("Added a Campground");
        //             // create a comment
        //             Comment.create(
        //                 {
        //                     text: "This place is great, but I wish there was internet",
        //                     author: "Homer"
        //                 }, (err, comment) => {
        //                     if(err) {
        //                         console.log(err);
        //                     } else {
        //                         campground.comments.push(comment);
        //                         campground.save();
        //                         console.log("New Comment Created")
        //                     }
        //                 })
        //         }
        //     })
        // });
    });
}

module.exports = seedDB;