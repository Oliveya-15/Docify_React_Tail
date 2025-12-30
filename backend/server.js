import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

//app config
const app = express()
const port  = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())

app.use(cors({
    origin: [
      "https://docify-frontend-yw8c.onrender.com",
      "https://docify-admin.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "token", "atoken"],
    credentials: true
  }))

app.options("*", cors())

//api endpoints
app.use('/api/admin/',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send('API Working Great')
})

app.listen(port, ()=> console.log("Server Started",port))