const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    title: {
        type: String,
        required:[true, "A title is required"] 
    }, 
    description: { 
        type: String,
        required:[true, "A description is required"]  
    }, 
    category: String, 
    subcategory: String,
    media: String,
    post_image: String,
    owner:{
        type: String,
        required: [true, "An owner is required"] 
    },
    city: String,
    state: String, 
    country: String, 
},{
    timestamps: true,
});

const Post = model('Post', postSchema);

module.exports = Post;