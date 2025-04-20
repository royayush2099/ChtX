import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res)=>{
    const{fullName, email, password}  =req.body;
    try{
        //checking that email || password ||fullname should be provided
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are requi"})
        }
     
     if(password.length <6){
        return res.status(400).json({message:"Password must be atleast 6 characters"});
     }
     const user = await User.findOne({email})
     if(user) return res.status(400).json({message:"Email already exists"});
     //hash password
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password,salt)
     //creating the new user
     const newUser = new User({
        fullName:fullName,
        email:email,
        password:hashedPassword,
     })
     if(newUser){
         //generate jwt token
         generateToken(newUser._id,res)
         await newUser.save()//saves the new user in database

         res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
         })
     }
     else{
        res.status(400).json({message:"Invalid user data"});
     }
    }catch(err){
   console.log("Error in signup controller",err.message);
   res.status(500).json({message:"Internal Server Error"});
    }
    //res.send("singup route")
}
export const login = async (req,res)=>{
    const {email,password }= req.body
      try{
    const user = await User.findOne({email})  
    if(!user){
        return res.status(400).json({message:"Invalid credentials"})
    }
    //checking the password is correct or not
  const isPasswordCorrect =  await bcrypt.compare(password,user.password)
  if(!isPasswordCorrect){
    return res.status(400).json({message:"Invalid Credentials"});
  }

  //generation the token
  generateToken(user._id,res)
  res.status(200).json({
    _id:user._id,
    fullName:user.fullName,
    email:user.email,
    profilePic:user.profilePic,
  })
      }
      catch(err){
      console.log("Error in login controller",err.message);
      res.status(500).json({message:"Internal Server Error"})
      }
    //res.send("login route")
}
export const logout = (req,res)=>{
    //clearing out the cookies and logout
    try{
     res.cookie("jwt","",{maxAge:0})
     res.status(200).json({message:"Logged out successfully"})
    }
    catch(err){
   console.log("Error in logout controller",err.message)
   res.status(500).json({message:"Internal Server Error"})
    }
   // res.send("logout route")
}

export const updateProfile = async (req,res)=>{
 try{
const {profilePic} = req.body;
//we can use ._id because it is provided in protectroute
const userId = req.user._id;
if(!profilePic){
    return res.status(400).json({message:"Profile pic is required"});
}
//uploading the picture to cloudinary bucket 
const uploadResponse = await cloudinary.uploader.upload(profilePic);
//adding the profile pic to the database in string format
const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
//new is applied because as default findByIdAnd Update return the old document as it is before the update
res.status(200).json(updatedUser);
 }
 catch(err){
 console.log("error in update profile",err)
 res.status(500).json({message:"Internal server error"});
 }
}



export const checkAuth = (req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(err){
        console.log("Error in checkAuth controller, error.message");
        res.status(500).json({message:"Internal Server Error"});
    }
}

//need to change something

