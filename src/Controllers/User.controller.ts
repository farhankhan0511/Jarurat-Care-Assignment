import { asynchandler } from "../utils/asynchandler";

import { NextFunction, Request, Response } from "express";
import {z, ZodString} from "zod"
import { statuscodes } from "../utils/constants";
import { roles, User } from "../models/User.model";
import { ApiResponse } from "../utils/ApiRespnse";

//Registration of user

interface UserrequestBody{
  Name:string,
  username:string,
  email:string,
  Phone:string,
  password:string,


}


const RegistrationSchema=z.object({
    Name:z.string(),
    username:z.string(),
    email:z.string().email(),
    Phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must not exceed 15 digits").regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format"),
    password:z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, 
         "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one digit",
    ),
})
const LoginSchema=z.object({
    email:z.string().email(),
    password:z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, 
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one digit",
   )

})


export const UserRegistration=asynchandler(async(req:Request,res:Response)=>{
    let validdata:UserrequestBody;
    try {
        validdata=RegistrationSchema.parse(req.body)
    } catch (err:any) {
        return res.status(statuscodes.BADREQUEST).json(
        new ApiResponse(statuscodes.BADREQUEST,{},err.message || "bad request")
        )
    }
    const existuser=await User.findOne({email:validdata.email})
    if (existuser){
        return  res.status(statuscodes.BADREQUEST).json(
        new ApiResponse(statuscodes.BADREQUEST,{},"User already exists")
        )
    }
   

    const user=await User.create({
        Name:validdata.Name,
        username:validdata.username,
        Phone:validdata.Phone,
        email:validdata.email,
        password:validdata.password,
        role:roles.user
    }
    )
    if (!user) {
        return  res.status(statuscodes.BADREQUEST).json(
        new ApiResponse(statuscodes.INTERNALERROR,{},"Error while registration of the partenr")
        )
    }
    return res.status(statuscodes.SUCCESFULL).json(
        new ApiResponse(statuscodes.CREATED,user,"User registered Successfullly")
    )


})

const generateaccessandrefreshtoken=async(user_Id:any)=>{
    const user= await User.findById(user_Id)
    if (!user){
        
       throw  new ApiResponse(statuscodes.INTERNALERROR,{},"Error while generating tokens")
        
    }
    const accesstoken= await user.generateaccesstoken();
    const refreshtoken=await user.generaterefreshtoken();
    user.refreshtoken=refreshtoken;
    await user.save({validateBeforeSave:false})
    return {accesstoken,refreshtoken}
}


export const LoginUser=asynchandler(async(req:Request,res:Response)=>{

    const {email,password}=req.body
    let validlogin:any;
    try {
        
        validlogin=LoginSchema.parse({email:email,password:password})
    } catch (err) {
        return res.status(statuscodes.BADREQUEST).json(
        new ApiResponse(statuscodes.BADREQUEST,{},"Email and password should be in format")
        )
    }

    const user=await User.findOne({email:validlogin.email})
  
    if(!user){
        return res.status(statuscodes.BADREQUEST).json(
        new ApiResponse(statuscodes.BADREQUEST,{},"User doesn't exists")
        )
    }
    let validpass= await user.isPasswordCorrect(validlogin.password)
    if(!validpass){
        return res.status(statuscodes.BADREQUEST).json(
        new ApiResponse(statuscodes.BADREQUEST,{},"Incorrect Password")
        )
    }
    const {accesstoken,refreshtoken}= await generateaccessandrefreshtoken(user._id)
    const loggedinuser=await User.findById(user._id).select("-password -refreshtoken")

    const options={
        httpOnly:true,
        secure:false,
    }

    res.status(statuscodes.SUCCESFULL)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new ApiResponse(statuscodes.SUCCESFULL,{loggedinuser,accesstoken,refreshtoken},"user logged in successfully")
    )

})

export const DeleteUser=asynchandler(async(req:Request,res:Response)=>{
    const userid=req.user;
    try {
        const existeduser=await User.findById(userid)
        if(!existeduser){
            return res.status(statuscodes.BADREQUEST).json(
                new ApiResponse(statuscodes.BADREQUEST,{},"User doesn't exists")
            )
        }
        await User.findByIdAndDelete(existeduser._id);
        res.status(statuscodes.SUCCESFULL).json(
            new ApiResponse(statuscodes.SUCCESFULL,{},"User Deleted Succesfully")
        )
    } catch (error) {
        res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Internal Error while deleting the user"))
    }
})

export const UpdateUserphone=asynchandler(async(req:Request,res:Response)=>{
    const user=req.user;
    const {phone}=req.body;
    try {
        const existeduser=await User.findById(user._id)
        if(!existeduser){
            return res.status(statuscodes.BADREQUEST).json(
                new ApiResponse(statuscodes.BADREQUEST,{},"User doesn't exists")
            )
        }
        await User.findByIdAndUpdate(existeduser._id,{$set:{phone:phone}},{new:true});
        res.status(statuscodes.SUCCESFULL).json(
            new ApiResponse(statuscodes.SUCCESFULL,{},"Phone Updated Succesfully")
        )
    } catch (error) {
        res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Internal Error while updating the user"))
    }

})

export const changeCurrentPassword=asynchandler(async(req:Request,res:Response)=>{

    const {oldPassword,newPassword}=req.body
    const user= await User.findById(req.user?._id)
    if(!user){
        return res.status(statuscodes.NOTFOUND).json(new ApiResponse(statuscodes.NOTFOUND,{},"No user Found"))
    }
    const isPassword=await user.isPasswordCorrect(oldPassword)

    if(!isPassword){
        return res.status(statuscodes.BADREQUEST).json(new ApiResponse(statuscodes.BADREQUEST,{},"Incorrect Password"))
  

    }

    user.password=newPassword
    await user.save({validateBeforeSave:false})


    return res.status(statuscodes.SUCCESFULL).json(new ApiResponse(statuscodes.SUCCESFULL,{},"Password Changed Successfully"))

})






