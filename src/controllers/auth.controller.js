import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

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
export const login = (req,res)=>{

    res.send("login route")
}
export const logout = (req,res)=>{
    res.send("logout route")
}


//need to change something

