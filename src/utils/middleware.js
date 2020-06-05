const jwt = require('jsonwebtoken');
const Post = require('../models/post.model');

const multer = require('multer');
const { v4: uuidv4} = require ('uuid');

    const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, process.env.RUTA_SERVER+ 'public/uploads/images/');
    },
    filename: function(req, file, callback) {
        callback(null,uuidv4()+".jpg")}
    });

    const upload = multer({ storage: storage }).single("photo");


module.exports = {

    async savePhoto(req, res, next) {
        try{
            //await upload.single('photo'); 
            //await upload(req,res,next);
            await upload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                  // A Multer error occurred when uploading.
                } else if (err) {
                  // An unknown error occurred when uploading.
                }
                
                next();   //Por que toca poner esto aqui??
            }); 

        } catch(error){

        }  
    },

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
