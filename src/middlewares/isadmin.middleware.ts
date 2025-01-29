import { Response,Request, NextFunction } from "express";

import { asynchandler } from "../utils/asynchandler";
import { statuscodes } from "../utils/constants";
import { ApiResponse } from "../utils/ApiRespnse";

export const isadmin=asynchandler(async(req:Request,res:Response,next:NextFunction)=>{
    const user=req.admin;
    if (!user){
        return res.status(statuscodes.BADREQUEST).json( new ApiResponse(statuscodes.BADREQUEST,{},"Not authorized to access the admin page")
)}
    next();
})