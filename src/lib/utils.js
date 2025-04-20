import jwt from 'jsonwebtoken';

export const generateToken = (userId,res)=>{
const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"7d"
})
res.cookie("jwt",token,{
    maxAge: 7*24*60*60*1000,//milisecond
    httpOnly:true,//prevents xss attacks cross-site scripting attacks
    sameSite:"strict",//csrf attacks cross-site request forgery atttacks
    secure:process.env.NODE_ENV !== "development"//checks if it is in developement or in production
});
return token;
}