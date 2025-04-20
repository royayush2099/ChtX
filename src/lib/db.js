import mongoose from 'mongoose'
export const connectDB = async ()=>{
    try{
       const conn =  await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDb connected : ${conn.connection.host}`)
    }catch(err){
        console.log("Mongodb connection error:",err)
    }
}