const Provider = require('../models/provider.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { transporter, welcome, recovery} = require('../utils/mail');

module.exports = {
    async list(req, res){
        const providers= await Provider.find();
        res.status(200).json(providers);
    },
    async create(req, res) {
        try {
            if (!req.body.password) {
                throw Error("Please include password");
            }
            if (!req.body.email) {
                throw Error("Please include email");
            }

            const password = await bcrypt.hash(req.body.password, 10);
            const email = req.body.email.toLowerCase();
            const provider = await Provider.create({ ...req.body, email, password });

            const token = await jwt.sign({ "id": provider._id }, process.env.SECRET, { expiresIn: 60 * 60 });

            const mail = {
                from: '"Artisthub App" <artisthub@zohomail.com',
                to: email,
                subject: "Welcome",
                ...welcome(req.body.name),
            }
            await transporter.sendMail(mail, (err) => {console.log(err)});

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

            let active;
            if (provider.endDate){
                const today = new Date();
                if (today - provider.endDate < 0){    //Aun tiene suscripcion activa
                    active=true;
                }else {
                    active=false;
                }
            }else {
                active=false;
            }


                res.status(200).json({token, active});
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
        const provider = await Provider.findByIdAndUpdate(userId, req.body, options);
        res.status(200).json(provider);
    },
    async updatePassword(req, res) {
        try {
            const password = await bcrypt.hash(req.body.password, 10);
            const options = {
                new: true,
            };
            const userId = req.user.id;
            const provider = await Provider.findByIdAndUpdate(userId, {password}, options);
            res.status(200).json(provider);
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    },
    async updateEndDate (req, res){
        try {
            const options ={
                new: true,
            };
            const providerId = req.user.id;
            let provider = await Provider.findById(providerId);
            let endDate;
            if (provider.endDate){
                const today = new Date();
                if (today - provider.endDate < 0){    //Aun tiene suscripcion activa
                    endDate=moment(provider.endDate).add(30,'days').toDate();
                }else {
                    endDate= moment().add(30,'days').toDate();
                }
            }else {
                endDate= moment().add(30,'days').toDate();
            }
            //Esto para evitar que un mismo pago se aplicara dos veces
            let payments;
            if (provider.payments){
                payments=provider.payments;
            }else{
                payments = [];
            }
            if (payments.includes(req.body.refPago)){
                  throw Error("Este pago ya se habia registrado"); 
            }else {
                payments.push(req.body.refPago);
            }

            provider = await Provider.findByIdAndUpdate(providerId, {endDate: endDate, payments: payments}, options);
            res.status(200).json(provider);
        }catch (error){
            //console.log(error);
            res.status(402).json({ message: error.message });
        }
    },
    async show (req, res){
        const userId = req.user.id;
        const provider = await Provider.findById(userId, req.body);
        res.status(200).json(provider);
    },
    async recover(req, res) {
        try {
            const provider = await Provider.findOne({email: req.body.email});
            const token = await jwt.sign({ "id": provider._id }, process.env.SECRET, { expiresIn: 60 * 10 });
            const link = process.env.FRONTEND_SERVER +"changepassword?typeOfUser=provider&token="+token;
            const mail = {
                from: '"Artisthub App" <artisthub@zohomail.com',
                to: provider.email,
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
        const provider = await Provider.findByIdAndDelete(userId);
        res.status(200).json(provider);
    },  

} 