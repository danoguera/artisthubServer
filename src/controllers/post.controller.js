const Post = require('../models/post.model');


module.exports = {
    async list(req, res){
        const owner= req.user.id;
        const posts= await Post.find({ owner: owner});
        res.status(200).json(posts);
    },
    async create(req, res){
        try{    //se añade el post image usando midleware savePhoto
            //const post_image= process.env.PHOTO_SERVER + req.file.filename;
            const post_image = req.body["photo"].url;
            const post = await Post.create({...req.body, owner:req.user.id, post_image});
            res.status(200).json(post);
        } catch (error){
            res.status(401).json(error);
        }  
    }, 
    async update (req, res){
        try {
            let modified, post_image;
            if (req.body["photo"]) {
                post_image = req.body["photo"].url;
                modified = {...req.body, post_image}
            }else {
                modified = {...req.body};
            }
            const options ={
                new: true,
            };
            const postId = req.params.postId;
            const post = await Post.findByIdAndUpdate(postId, modified, options);
            res.status(200).json(post);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }

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
    async showAllCategory (req, res){
        const categoryName = req.params.categoryName;
        const posts = await Post.find({category: categoryName} );
        res.status(200).json(posts);
    },
    async destroy(req, res){
        const postId = req.params.postId;
        const post = await Post.findByIdAndDelete(postId);
        res.status(200).json(post);
    },
    async filterByCategory(req, res){
        const categoryName = req.params.categoryName;
        const subcategoryName = req.params.subcategoryName;
        const posts = await Post.find({subcategory: subcategoryName, category: categoryName} );
        res.status(200).json(posts);
    },



} 