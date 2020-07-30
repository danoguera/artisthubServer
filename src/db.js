const mongoose = require('mongoose');

function initDatabase(){

    const options = {
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
    } 

    mongoose.connect(process.env.MONGO_URL, options);

    const {connection} = mongoose;

    connection.once("open", () => console.log(`DB connection established...${process.env.MONGO_URL} `));
    connection.on("error", (err) => console.log("Error: ",err));

    return connection;
} 


module.exports = initDatabase;