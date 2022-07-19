const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password, 12);
    this.confirmPassword= undefined;
    this.otp = await bcrypt.hash(this.otp, 12);
    this.username = this.email.split('@')[0];
    next();
});

userSchema.methods.signToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}
userSchema.methods.compareOTP = async function(reqOTP, dbOTP){
    return await bcrypt.compare(reqOTP, dbOTP)
}

const User = new mongoose.model('User', userSchema);
module.exports = User;