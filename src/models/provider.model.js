const {model, Schema, models} = require('mongoose');

const uniquemail =  {
    validator(value) {
      return models.Provider.findOne({ email: value })
        .then(user => !user)
        .catch(() => false);
    },
    message: 'Email already exists'
  }
const providerSchema = new Schema({
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
    documentId: String,
    endDate: Date,
    payments: [String],


},{
    timestamps: true,
});

const Provider = model('Provider', providerSchema);

module.exports = Provider;