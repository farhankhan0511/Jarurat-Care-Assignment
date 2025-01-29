import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()
app.use(cors())
app.use(cookieParser())
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({limit:"16kb",extended:true}));
app.use(express.static("public"));


import Userrouter from "./routes/User.routes"
import volunteerrouter from "./routes/Volunteer.routes"

app.use("/user",Userrouter);
app.use("/volunteer",volunteerrouter);

export default app;

