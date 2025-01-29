import mongoose,{Document, Schema} from "mongoose";
import { Timestamps } from "../utils/constants";


export interface VolunteerRegistrationI extends Document,Timestamps{
    User:Schema.Types.ObjectId,
    Opening:Schema.Types.ObjectId,
    Resume:string
}
const VolunteerRegistrationSchema=new mongoose.Schema({
    User:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    Opening:{
        type:Schema.Types.ObjectId,
        ref:"VolunteerOpening",
        required:true
    },    
    Resume:{
        type:String,
        required:true
    }

},{timestamps:true})

export const VolunteerRegistration=mongoose.model<VolunteerRegistrationI>("VolunteerRegistration",VolunteerRegistrationSchema)