const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.generateToken = (user) => {
    const token = user.signToken(user.id);

    const cookieOption = {
        expire: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.DEV_MODE === "production") cookieOption.secure = true;

    return token;
};

exports.verifyToken = async (vToken) => {
    const tokenVerified = await promisify(jwt.verify)(
        vToken,
        process.env.JWT_SECRET
    );

    return tokenVerified;
};
