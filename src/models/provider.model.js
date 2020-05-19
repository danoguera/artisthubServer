const {model, Schema} = require('mongoose');

const providerSchema = new Schema({
    name: String,
    lastname: String,
    password: String, 
    username: String,
    city: String,
    state: String, 
    country: String, 
    birthDate: Date,
    documentID: String,
    description: String,
    url: String,

},{
    timestamps: true,
});

const User = model('Provider', providerSchema);