import "dotenv/config"
import app from "./app";
import { DBCONNECT } from "./db/db";

DBCONNECT()
.then(
    ()=>{
        app.listen(process.env.PORT || 8080,()=>{
            console.log("server is running")
        })
    }
)
.catch((err)=>console.log("Mongodb not connected",err))