const Post = require('../models/post.model');


module.exports = {
    async list(req, res){
        const posts= await Post.find();
        res.status(200).json(posts);
    },
    async create(req, res){
        try{ 
        const post = await Post.create({...req.body});
        res.status(200).json(post);
        } catch (error){
            res.status(401).json(error);
        }  
    }, 
    async update (req, res){
        const options ={
            new: true,
        };
        const postId = req.params.postId;
        const post = await Post.findByIdAndUpdate(postId, req.body, options);
        res.status(200).json(post);
    },
    async show (req, res){

        const postId = req.params.postId;
        const post = await Post.findById(postId, req.body);
        res.status(200).json(post);
    },
    async showAll (req, res){

        const subcategoryName = req.params.subcategoryName;
        const posts = await Post.find({subcategory: subcategoryName} );
        res.status(200).json(posts);
    },
    async destroy(req, res){
        const postId = req.params.postId;
        const post = await Post.findByIdAndDelete(postId);
        res.status(200).json(post);
    },



} 