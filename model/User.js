const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({

    username:{
        type:String
    },

    email:{
        type:String,
        required:[true, 'Please provide valid email address'],
        lowercase:true,
        trim:true,
        validate:[validator.isEmail, 'Please provide valid email'],
        unique:true
    },

    password:{
        type:String,
        required:[true, 'Please provide valid password'],
        minlength:[8, 'Password must be atleast 8 character long'],
        trim:true,
        select:false
    },
    confirmPassword:{
        type:String,
        validate:{
            validator: function(el){
              return  el ===this.password
            },
            message:'Confirm password field must match password'
        }

    },

    phoneNumber:{
        type:String,
        required:[true, 'Please provide valid contact details'],
        minlength:[10, 'Contact number must be atleast 10 digit number'],
        trim:true
    },
    otp:{
        type:String
    },
    active:{
        type:Boolean,
        default:false,
    }
})

const User = new mongoose.model('User', userSchema);
module.exports = User;