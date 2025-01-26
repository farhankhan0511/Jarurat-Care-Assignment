import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants";

export const DBCONNECT=async()=>{
  try {
      
  const connection=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
  console.log(connection.connection.host);
  
  } catch (error) {
    console.error("Error while connecting to the database",error);
    process.exit(1);
  }
}