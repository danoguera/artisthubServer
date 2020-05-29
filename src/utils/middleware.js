const jwt = require('jsonwebtoken');
const Post = require('../models/post.model');



module.exports = {

    async auth(req, res, next) {
        try {
            const token = req.headers.authorization;
            req.user = await jwt.verify(token, process.env.SECRET);
            next();
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    },
    
    async verify(req, res, next) {
        try {
            
            const token = req.headers.authorization;
            req.user = await jwt.verify(token, process.env.SECRET);
   
            const post = await Post.findById(req.params.postId);
            if (!post){
                throw Error("No existe el post");         
            } 
            if (post.owner === req.user.id){ 
                next();
            }else{
                throw Error("El post no pertenece al usuario"); 
            }  
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
} 
