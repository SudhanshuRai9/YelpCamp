const mongoose = require('mongoose');

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    image_id: { type: String, required: true },
    image_name: { type: String, required: true },
    desc: { type: String, required: true },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model("Campground", campgroundSchema);