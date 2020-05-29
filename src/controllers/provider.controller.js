const Provider = require('../models/provider.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    async list(req, res){
        const providers= await Provider.find();
        res.status(200).json(providers);
    },
    async create(req, res){
        try{ 
            if (!req.body.password ){ 
                throw Error("Please include password");  
            }
            if (!req.body.email ){ 
                throw Error("Please include email");   
            }

            const password = await bcrypt.hash(req.body.password,10);
                const email = req.body.email.toLowerCase();
        const provider = await Provider.create({...req.body, email, password});

        const token = await jwt.sign({"id":provider._id},  process.env.SECRET, { expiresIn: 60 * 60});
  
        res.status(200).json(token);
        
        } catch (error){
            res.status(401).json({ message: error.message });
        }  
    }, 
    async signin(req,res){
        try{
            
            const provider = await Provider.findOne({email: req.body.email.toLowerCase()} );
            if (!provider){
                throw Error("Wrong user/password");         
            } 

            const password = provider.password;
            const result = await bcrypt.compare(req.body.password, password);
            if (result){
                const token = await jwt.sign({"id":provider._id},  process.env.SECRET, { expiresIn: 60 * 60});
                res.status(200).json(token );
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
        const provider = await Provider.findByIdAndUpdate(userId, req.body, options);
        res.status(200).json(provider);
    },
    async show (req, res){
        const userId = req.params.userId;
        const provider = await Provider.findById(userId, req.body);
        res.status(200).json(provider);
    },
    async destroy(req, res){
        const userId = req.params.userId;
        const provider = await Provider.findByIdAndDelete(userId);
        res.status(200).json(provider);
    },

} 