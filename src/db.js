const mongoose = require('mongoose');

function initDatabase(){

    const options = {
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
    } 


    mongoose.connect("mongodb://127.0.0.1:27017/artisthub", options);

    const {connection} = mongoose;

    connection.once("open", () => console.log("DB connection established..."));
    connection.on("error", (err) => console.log("Error: ",err));

    return connection;
} 


module.exports = initDatabase;