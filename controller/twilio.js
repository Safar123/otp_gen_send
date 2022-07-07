const accountID = process.env.TWILIO_ACCOUNT_ID;
const tokenID= process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountID, tokenID);

const sendOTP = async(otp, phoneNumber)=>{
    client.messages.create({
        body:`Your signup OTP is ${otp}`,
        from:`${process.env.CONTACT_PROFILE}`,
        to:`${phoneNumber}`
    }).then(message =>console.log(message.sid)).done();

}

 module.exports= sendOTP;