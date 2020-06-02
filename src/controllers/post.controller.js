const Post = require('../models/post.model');


module.exports = {
    async list(req, res){
        const owner= req.user.id;
        const posts= await Post.find({ owner: owner});
        res.status(200).json(posts);
    },
    async create(req, res){
        try{ 
            const post = await Post.create({...req.body, owner:req.user.id});
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

        try {
            const postId = req.params.postId;
            const post = await Post.findById(postId, req.body);
            res.status(200).json(post);
            
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
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