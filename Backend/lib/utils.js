import jwt from 'jsonwebtoken';

export const genToken = (userId, res) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("jwt", token,{
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, //prevents xss attacks
        sameSite: "strict", //prevents csrf attacks
        secure: process.env.NODE_ENV !== "development", //use secure cookies in production
    })

    return token;
} 