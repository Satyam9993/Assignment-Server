require('dotenv').config()

// options for cookies
const accessTokenOptions = {
    httpOnly : true,
    sameSite : true
}

const sendToken = async(user, statusCode, res)=>{
    const accessToken = await user.SignAccessToken();

    // only set secure to true in production
    if(process.env.NODE_ENV === 'production'){
        accessTokenOptions.secure = true;
    }

    res.status(statusCode).json({
        success:true,
        user,
        accessToken
    })
}

const sendTokenVendor = async(vendor, statusCode, res)=>{
    const accessToken = await vendor.SignAccessToken();

    // only set secure to true in production
    if(process.env.NODE_ENV === 'production'){
        accessTokenOptions.secure = true;
    }

    res.status(statusCode).json({
        success:true,
        vendor,
        accessToken
    })
}

module.exports = {
    accessTokenOptions,
    sendTokenVendor,
    sendToken
};