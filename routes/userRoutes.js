const express = require('express');
const {signUp, verifyOTP} = require('../controller/userController')

const router = express.Router();

router.route('/signUp').post(signUp);
router.route('/signUp/verify').post( verifyOTP)


module.exports = router