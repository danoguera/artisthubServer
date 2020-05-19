const { Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: String,
    lastname: String,
    password: String, 
    username: String,
    city: String,
    state: String, 
    country: String, 
    birthDate: Date,
    documentID: String

},{
    timestamps: true,
});

const User = model('User', userSchema);

module.exports = User;