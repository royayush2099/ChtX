import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
//here we are using next function to just call the next funtion after this
export const protectRoute = async (req,res,next)=>{
  try{
  const token =  req.cookies.jwt;
  if(!token){
    return res.status(401).json({message:"Unauthorized - No Token Provided"});
  }
  const decoded = jwt.verify(token,process.env.JWT_SECRET)//decoding the secret or information from cookie
   if(!decoded){
    return res.status(401).json({message:"Unauthorized - Invalid Token"});
   }

   const user = await User.findById(decoded.userId).select("-password");//just deselecting the password with - mark to send everything accept passwor to the client
   if(!user){
    return res.status(404).json({message:"User not found"});
   }
   req.user = user//adding the user to req.user
   next()//calling the next function in this case updateProfile
  }
  catch(err){
console.log("Error in protectRoute middleware",err.message);
res.status(500).json({message:"Internal server error"})
  }
}