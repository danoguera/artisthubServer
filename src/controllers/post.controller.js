const Post = require('../models/post.model');
const { transporter, paymentMail, paymentMailUser, contactMail} = require('../utils/mail');
const User = require('../models/user.model');
const Provider = require('../models/provider.model');

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
            res.status(401).json({ message: error.message });
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
    async payment(req, res){
        const message = req.body.message;
        const userId = req.user.id;
        const postId = req.params.postId;
        const posts = await Post.findById(postId);
        const client = await User.findById(userId);
        const provider = await Provider.findById(posts.owner);
        const mail = {
            from: '"Artisthub App" <artisthub@zohomail.com>',
            to: provider.email,
            subject: "ArtistHub - Payment Notice",
            ...paymentMail(posts.fare,posts.title,posts.description,client.name + ' ' + client.lastname,client.email,message,req.body.refPago,req.body.eventDate),
        }
        await transporter.sendMail(mail, (err) => {console.log(err)});
        
        const mailUser = {
            from: '"Artisthub App" <artisthub@zohomail.com>',
            to: client.email,
            subject: "ArtistHub - Payment Confirmation",
            ...paymentMailUser(posts.fare,posts.title,posts.description,provider.name + ' ' + provider.lastname,provider.email),
        }
        await transporter.sendMail(mailUser, (err) => {console.log(err)});
        res.status(200).json(posts);
    },

    async contact(req, res){
        const message = req.body.description;
        const userId = req.user.id;
        const postId = req.body.postId;
        const posts = await Post.findById(postId);
        const client = await User.findById(userId);
        const provider = await Provider.findById(posts.owner);
        const mail = {
            from: '"Artisthub App" <artisthub@zohomail.com>',
            to: provider.email,
            subject: "ArtistHub - Contact from an User",
            ...contactMail(posts.title,posts.description,client.name + ' ' + client.lastname,client.email,message),
        }
        await transporter.sendMail(mail, (err) => {console.log(err)});
        
        res.status(200).json(posts);
    },
} 