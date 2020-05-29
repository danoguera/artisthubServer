const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    async list(req, res){
        const users= await User.find();
        res.status(200).json(users);
    },
    async create(req, res){
        try{ 
        const password = await bcrypt.hash(req.body.password,10);
        const email = req.body.email.toLowerCase();
        const user = await User.create({...req.body, email, password});

        const token = await jwt.sign({"id":user._id},  process.env.SECRET, { expiresIn: 60 * 60});
  
       
        res.status(200).json(token);
        } catch (error){
            res.status(401).json(error);
        }  
    }, 
    async signin(req,res){
        try{

            const user = await User.findOne({email: req.body.email.toLowerCase()} );
            if (!user){
                throw Error("Wrong user/password");         
            } 

            const password = user.password;
            const result = await bcrypt.compare(req.body.password, password);
            if (result){
                const token = await jwt.sign({"id":user._id},  process.env.SECRET, { expiresIn: 60 * 60});
                res.status(200).json(token);
            } else {
                res.status(401).json("Wrong user/password");
            } 
         } 
        catch (error){
             res.status(401).json({ message: error.message });
        } 
    },
    async update (req, res){
        const options ={
            new: true,
        };
        const userId = req.params.userId;
        const user = await User.findByIdAndUpdate(userId, req.body, options);
        res.status(200).json(user);
    },
    async show (req, res){

        const userId = req.params.userId;
        const user = await User.findById(userId, req.body);
        res.status(200).json(user);
    },
    async destroy(req, res){
        const userId = req.params.userId;
        const user = await User.findByIdAndDelete(userId);
        res.status(200).json(user);
    },
} 