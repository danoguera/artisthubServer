const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { transporter, welcome, recovery} = require('../utils/mail');

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
  

        const mail = {
            from: '"Artisthub App" <artisthub@zohomail.com>',
            to: email,
            subject: "Welcome",
            ...welcome(req.body.name),
        }
        await transporter.sendMail(mail, (err) => {console.log(err)});
       
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
        const userId = req.user.id;
        const user = await User.findByIdAndUpdate(userId, req.body, options);
        res.status(200).json(user);
    },
    async updatePassword (req, res){
        try{ 
            const password = await bcrypt.hash(req.body.password,10);
            const options ={
                new: true,
            };
            const userId = req.user.id;
            const user = await User.findByIdAndUpdate(userId, {password}, options);
            res.status(200).json(user);
        } 
        catch (error){
             res.status(401).json({ message: error.message });
        } 
    },
    async show (req, res){
        const userId = req.user.id;
        const user = await User.findById(userId, req.body);
        res.status(200).json(user);
    },
    async recover(req, res) {
        try {
            const user = await User.findOne({email: req.body.email});
            const token = await jwt.sign({ "id": user._id }, process.env.SECRET, { expiresIn: 60 * 10 });
            const link = process.env.FRONTEND_SERVER +"changepassword?typeOfUser=user&token="+token;
            const mail = {
                from: '"Artisthub App" <artisthub@zohomail.com',
                to: user.email,
                subject: "Password Reset Instructions",
                ...recovery(link),
            }
            await transporter.sendMail(mail, (err) => {console.log(err)});
            res.status(200).json(token);
        
        } catch (error){
            res.status(401).json({ message: error.message });
        }  
    }, 
    async destroy(req, res){
        const userId = req.user.id;
        const user = await User.findByIdAndDelete(userId);
        res.status(200).json(user);
    },
} 