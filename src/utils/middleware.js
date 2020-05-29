const jwt = require('jsonwebtoken');

module.exports = {

async auth(req, res, next){

    try {
        
        const token = req.headers.authorization;
        const result = await jwt.verify(token,  process.env.SECRET);
    
        next();
        
    } catch (error) {

        res.status(401).json({ message: error.message });
    } 



} 



} 
