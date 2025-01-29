
import mongoose, { Document, Schema } from "mongoose";
import jwt, { Secret, SignOptions} from "jsonwebtoken"
import bcrypt from "bcrypt"
import ms from "ms";
import { defexpiry, Timestamps } from "../utils/constants";
import { ApiResponse } from "../utils/ApiRespnse";

export enum roles{
    admin="admin",
    user="user"
}




export interface IUser extends Document,Timestamps{
    username:string,
    Name:string,
    email:string,
    Phone:string,
    role:roles,    
    password:string,
    refreshtoken?:string,
    isPasswordCorrect(password: string): Promise<boolean>, // Add the method here
    generateaccesstoken(): Promise<string>,
    generaterefreshtoken(): Promise<string>,
}

const UserSchema=new Schema({
    username:{
        type:String,
        lowercase:true,
        required:[true,"username is required"],
        unique:true,
        trim:true,
        index:true,

    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    role:{
        type:String,
        enum:Object.values(roles),
        required:true
    },
    Name:{
        type:String,
        required:true,
        trim:true,
    },
    Phone:{
        type:String,
        required:true,
        unique:true,

    },
    password:{
        type:String,
        required:[true,"Password is required"]

    },
    refreshtoken:{
        type:String
    }

},{timestamps:true})

UserSchema.pre("save",async function (next) {
    if (!this.isModified("password")) return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
    
})
UserSchema.methods.isPasswordCorrect=async function (password:string):Promise<boolean> {
    return await bcrypt.compare(password,this.password)
}


UserSchema.methods.generateaccesstoken=async function ():Promise<any> {
    const accesstoken:Secret|undefined=process.env.ACCESS_TOKEN_SECRET as string;
    const expiry: number= Number(process.env.ACCESS_TOKEN_EXPIRY)|| defexpiry.access;
    const options: SignOptions = { expiresIn: expiry }
    if (!accesstoken){
        return new ApiResponse(500,{},"Access token is invalid")
    }
    return jwt.sign({
        _id:this._id,
        role:this.role
    },accesstoken,
    options)
}
UserSchema.methods.generaterefreshtoken=async function ():Promise<any> {
    
const refreshtoken:Secret|undefined=process.env.REFRESH_TOKEN_SECRET as string;
const rexpiry:number = Number(process.env.REFRESH_TOKEN_EXPIRY)|| defexpiry.refresh;
    
    // Handle expiry conversion using ms library
    
    
    const options: SignOptions = {
        expiresIn: rexpiry
    };
if (!refreshtoken){
    return new ApiResponse(500,{},"Access token is invalid")
}
    return jwt.sign({
        _id:this._id,
        role:this.role        
    },refreshtoken,
    options
    )
}

export const User=mongoose.model<IUser>("User",UserSchema)