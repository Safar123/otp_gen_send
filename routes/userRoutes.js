const express = require('express');
const {signUp, verifyOTP, checkToken} = require('../controller/userController')

const router = express.Router();

router.route('/signUp').post(signUp);
router.route('/signUp/verify').post( checkToken, verifyOTP)


module.exports = router