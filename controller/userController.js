const User = require('../model/User');
const sendOtp = require('./twilio');
const generateOtp = require('./otpgenerator')

exports.signUp = async(req,res,next)=>{

    if(!req.body.phoneNumber){
        return res.status(400).json({
            status:'fail',
            message:'please provide valid phone number'
        })
    }

    let user = await User.findOne({email:req.body.email});

    if(user){
        return res.status(400).send('User already exist either login or sign up with new email')
    }

  
   
    try {
        const otp = await generateOtp();
        await sendOtp(otp, req.body.phoneNumber);
        
        res.status(200).json({
            status:'success',
            message:"OTP has been send to provided number. Please verify your otp on '/api/v1/user/signUp/verify' "
        })
       
        user = await User.create({
            email:req.body.email,
            password:req.body.password,
            confirmPassword:req.body.confirmPassword,
            username:req.body.username,
            phoneNumber:req.body.phoneNumber,
            otp
        });
    
     
    }
    catch(err){
        console.log(err)
    }

}


exports.verifyOTP = async(req,res)=>{

    const user = req.user;

    if(!req.body.otp){
        return res.status(400).json({
            status:'fail',
            message:'Please provide the otp you have recieved'
        })
    }

    const otpNumber = req.body.otp;

    if(otpNumber !==user.otp){
        return res.status(403).json({
            status:'Fail',
            message:'OTP doesnt match'
        })
    }

    await user.save({validateBeforeSave:false});

    res.status(201).json({
        status:'success',
        data:{
            user
        }
    })


}