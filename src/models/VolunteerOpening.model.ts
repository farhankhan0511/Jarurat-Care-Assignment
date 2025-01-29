import mongoose,{Document} from "mongoose";
import { Timestamps } from "../utils/constants";


export interface VolunteerOpeningI extends Document,Timestamps{
    Title:string,
    Description:String,
    Capacity:Number,
    Image:string,
    Benifits:string
}
const VolunteerOpeningSchema=new mongoose.Schema({

    Title:{
        type:String,
        required:[true,"Title is required"],
        unique:true,
        trim:true,
    },
    Description:{
        type:String,
        required:[true,"Description is required"],
        trim:true,
        maxLength:[500,"Description must be less than 500 characters"]
    },
    Capacity:{
        type:Number,
        required:[true,"Capacity is required"],
        
    },
    Image:{
        type:String,
        required:true,
    },
    Benifits:{
        type:String,
        required:true
    }

},{timestamps:true})

export const VolunteerOpening=mongoose.model<VolunteerOpeningI>("VolunteerOpening",VolunteerOpeningSchema)