import express from 'express'
import authRoute from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {connectDB} from "./lib/db.js"
import { app ,server,} from './lib/socket.js'
import path from 'path'


const PORT = process.env.PORT
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}))

app.use('/api/auth',authRoute)
app.use('/api/messages',messageRoutes);
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../Frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../Frontend","dist","index.html"));
    })
}

//replaced the app with server we created in socket.js
server.listen(5001,()=>{
console.log(`server is running on port ${PORT}`)
connectDB()
})

