const User = require('../model/User');
const sendOtp = require('./twilio');
const generateOtp = require('./otpgenerator');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcrypt = require('bcrypt')

exports.signUp = async (req, res, next) => {

    if (!req.body.phoneNumber) {
        return res.status(400).json({
            status: 'fail',
            message: 'please provide valid phone number'
        })
    }

    let ifUser = await User.findOne({ email: req.body.email });

    if (ifUser) {
        return res.status(400).send('User already exist either login or sign up with new email')
    }



    try {
        const otp = await generateOtp();
        await sendOtp(otp, req.body.phoneNumber);

        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            username: req.body.username,
            phoneNumber: req.body.phoneNumber,
            otp
        });

        const token = jwt.sign(user.id, process.env.JWT_SECRET)



        res.status(200).json({
            status: 'success',
            message: "OTP has been send to provided number. Please verify your otp on '/api/v1/user/signUp/verify' ",
            token
        })

    }
    catch (err) {
        console.log(err)
    }

}

exports.checkToken = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    const decodeToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    if (!decodeToken) {
        return res.status(403).json({
            status: 'fail',
            message: 'Unauthorized token value'
        })
    }

    const userExist = await User.findById(decodeToken);
    if (!userExist) {
        return res.status(404).json({
            status: 'fail',
            message: 'User doesnt exist for given token'
        })
    }

    req.user = userExist;
    next();

}


exports.verifyOTP = async (req, res) => {
    let user = req.user;
    if (!req.body.otp) {
        return res.status(400).json({
            status: 'Fail',
            message: 'Please verify using OTP you have recieved'
        })
    }

    if(user.otp === null){
        return res.status(400).json({
            status:'Fail',
            message:'Someone has tried logging using that OTP please try signing up again or report the issue'
        })
    }

    
    const validOtp = await bcrypt.compare(req.body.otp, user.otp);

    if (!validOtp) {
        return res.status(400).json({
            status: 'Fail',
            message: 'Invalid OTP please try again'
        })
    }

    let updateUser = await User.findByIdAndUpdate(user.id, {otp:null, active: true}, {
        new: true
    })


    res.status(200).json({
        status: 'success',
        message: 'Welcome to the system ',
        user: {
            updateUser
        }
    })



}