import { NextFunction,Request,Response } from "express";
import { asynchandler } from "../utils/asynchandler";
import { ApiResponse } from "../utils/ApiRespnse";
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../models/User.model";

declare module "express-serve-static-core"{
interface Request{
    user?:any;
    admin?:any;
}
}

export const verifyJWT=asynchandler(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const token=req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            return new ApiResponse(404,{},"Unauthorized Request")
        }
        const accesstoken=process.env.ACCESS_TOKEN_SECRET;
        if (!accesstoken){
            return new ApiResponse(404,{},"Unauthorized Request")
        }
        const decoded=await jwt.verify(token,accesstoken) as JwtPayload;
        const user=await User.findById(decoded._id).select("-password -refreshtoken");
        if(!user){
            return new ApiResponse(402,{},"Invalid access token");
        }
        if (user.role=="user"){
            req.user=user;
        }
        else{
            req.admin=user
        }
        next()

    } catch (err:any) {
        return new ApiResponse(404,{},"Invalid accesstoken")
    }
})