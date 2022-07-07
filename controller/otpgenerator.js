const bcrypt = require('bcrypt');
const crypto = require('crypto')
const generateRandomNumber = async ()=>{
    const randNumber = await crypto.randomBytes(3).toString('hex');
    return randNumber
}
module.exports = generateRandomNumber;