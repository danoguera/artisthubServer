const User = require('../models/user.model');


module.exports = {
    async list(req, res){
        const users= await User.find();
        res.status(200).json(users);
    },
    async create(req, res){
        const user = await User.create({...req.body});
        res.status(200).json(user);
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