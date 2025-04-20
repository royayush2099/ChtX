import mongoose  from "mongoose";
 const userSchema = new mongoose.Schema(
{
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    profilePic:{
        type:String,
        default:"",
    }
},{timestamps:true}
 );
 
 const User = mongoose.model("User",userSchema);
 //in mongodb User will get converted into user in small case
 export default User;