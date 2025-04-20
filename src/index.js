import express from 'express'
import authRoute from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import {connectDB} from "./lib/db.js"
dotenv.config()
const app = express();
const PORT = process.env.PORT
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoute)
app.use('/api/message',messageRoutes);
app.listen(5001,()=>{
console.log(`server is running on port ${PORT}`)
connectDB()
})

