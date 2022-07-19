const User = require("../model/User");
const sendOtp = require("./twilio");
const generateOtp = require("./otpgenerator");
const { verifyToken, generateToken } = require("../utils/tokenHandler");
const catchAsync = require("../utils/asyncErrorHandler");
const GlobalError = require('../utils/errorClass')

exports.signUp = catchAsync(async (req, res, next) => {
  if (!req.body.phoneNumber) {
    return next(new GlobalError('Please provide valid phone number'), 400)
  }

  let ifUser = await User.findOne({ email: req.body.email });

  if (ifUser) {
    return next (new GlobalError('User already exist either login or sign up with new email'), 400)
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
      otp,
    });

    const token = generateToken(user);
    res.status(200).json({
      status: "success",
      message:
        "OTP has been send to provided number. Please verify your otp on '/api/v1/user/signUp/verify' ",
      token,
    });
  } catch (err) {
    console.log(err);
  }
});

exports.checkToken = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  const decodeToken = await verifyToken(token);

  if (!decodeToken) {

    return next(new GlobalError('Unauthorized token value'), 403)
  }

  const userExist = await User.findById(decodeToken.id);
  if (!userExist) {

    return next (new GlobalError('User doesnt exist for given token'), 404)
  }

  req.user = userExist;
  next();
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  let user = req.user;

  if (!req.body.otp) {

    return next (new GlobalError('Please verify using OTP you have recieved'), 400);
  }

  if (user.otp === null) {
    return next(new GlobalError(
        "Someone has tried logging using that OTP please try signing up again or report the issue",
    ), 400);
  }

  const validOtp = await user.compareOTP(req.body.otp, user.otp);

  if (!validOtp) {
    return next(new GlobalError( "Invalid OTP please try again"), 400);
  }

  let updateUser = await User.findByIdAndUpdate(
    user.id,
    { otp: null, active: true },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Welcome to the system ",
    user: {
      updateUser,
    },
  });
});
