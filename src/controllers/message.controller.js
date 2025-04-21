import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import {v2 as cloudinary} from 'cloudinary';

export const getUsersForSidebar = async (req,res)=>{
 try{
    const loggedInUserId =  req.user._id;//this route is protected so we can grab the useras it is passed 
    const filterUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");//this means find all users but not find the current logginuser 
res.status(200).json(filterUsers); 
}catch(err){
console.error("Error in getUsersForSidebar:",err.message);
res.status(500).json({error:"Internal server error"});
}
};

export const getMessages = async (req,res)=>{
    try{
      const{id:userToChatId}= req.params;
      const myId = req.user._id;//we can access this user._id because we passed a protectRoute middleware in message routes
       //myId is the current user
       //giving the condition below find all the meesages where i am a sender or i am a receiver
      const messages = await Message.find({
        $or:[
            {senderId:myId, receiverId:userToChatId},
            {senderId:userToChatId,receiverId:myId}
        ]
      })
    
      res.status(200).json(messages);
    }catch(err){
      console.log("Error in getMessages controller:",err.message);
      res.status(500).json({error:"Internal server error"});
    }
}

export const sendMessage = async (req,res)=>{
    try{
     const {text,image}= req.body;
     const {id:receiverId} = req.params;
     const senderId = req.user._id;
     //checking if image is there
     let imageUrl;
     if(image){
        //upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
     }
     //message creation
     const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl,
     })
     await newMessage.save();
     //todo:realtime functionality goes here =>socket.io
     res.status(201).json(newMessage)
    }
    catch(err){
        console.log("Error in sendMessage controller",err.message);
        res.status(500).json({err:"Internal server error"})
    }
}