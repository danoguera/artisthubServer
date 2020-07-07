const { Schema, model, models} = require('mongoose');


const emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const uniquemail =  {
    validator(value) {
      return models.User.findOne({ email: value })
        .then(user => !user)
        .catch(() => false);
    },
    message: 'Email already exists'
  }

const userSchema = new Schema({
    name: {
        type: String,
        required:[true, "Name is required"] 
    }, 
    lastname:{ 
        type: String,
        required:[true, "Lastname is required"]  
    }, 
    password: String, 
    email:{
        type: String,
        required: [true, "Email is required"],
        validate: [uniquemail],  
    }, 
    username:{
        type: String,
    },
    city: String,
    state: String, 
    country: String, 
    birthDate: Date,
    documentId: String

},{
    timestamps: true,
});

const User = model('User', userSchema);

module.exports = User;