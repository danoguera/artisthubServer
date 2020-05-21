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
        const user = await User.create({...req.body, password});
        const token = jwt.sign({"id":user._id}, "Secreto", { expiresIn: 60 * 60 });
        res.status(200).json(token);
        //res.status(200).json(user);
        } catch (error){
            res.status(401).json(error);
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