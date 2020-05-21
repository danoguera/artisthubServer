const jwt = require('jsonwebtoken');

module.exports = {

async auth(req, res, next){

    try {
        console.log("Entre en el auth");
        const token = req.headers.authorization;
        console.log(token);
        const result = await jwt.verify(token, "Secreto");
        
        console.log(result);
    
        next();
        
    } catch (error) {

        res.status(401).json({ message: error.message });
    } 



} 



} 
