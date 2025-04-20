import User from "../models/user.model";

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
    
}