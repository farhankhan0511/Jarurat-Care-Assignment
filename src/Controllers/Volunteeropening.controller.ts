import { Request, Response } from "express";
import { asynchandler } from "../utils/asynchandler";
import { User } from "../models/User.model";
import { statuscodes } from "../utils/constants";
import { ApiResponse } from "../utils/ApiRespnse";
import { z } from "zod";
import { VolunteerOpening } from "../models/VolunteerOpening.model";
import { VolunteerRegistration } from "../models/VolunteerRegistration.model";
import { uploadresume } from "../utils/resumeupload";
import { removeimagefromcloudinary, uploadimageoncloudinary } from "../utils/imageupload";



const OpeningSchema=z.object({
    Title:z.string(),
    Description:z.string(),
    Capacity:z.number(),
    Benifits:z.string()
})

export const Addopening=asynchandler(async(req:Request,res:Response)=>{
    const admin=req.admin;
    let {Title,Description,Capacity,Benifits}=req.body;
    Capacity=Number(Capacity)
    const imagepath=req.file?.path;
    const exist=await User.findById(admin._id)
    try {
        if(!exist){
            return res.status(statuscodes.BADREQUEST).json(
                            new ApiResponse(statuscodes.BADREQUEST,{},"Admin doesn't exists")
                        )
        }
        const validdata=OpeningSchema.parse({Title,Description,Capacity,Benifits});
        if(!validdata || !imagepath){
            return res.status(statuscodes.BADREQUEST).json(
                new ApiResponse(statuscodes.BADREQUEST,{},"Incorrect data")
            )
        }
        const Image=await uploadimageoncloudinary(imagepath);
        if(!Image){
            return res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Error while uploading the image"))
        }

        const open=await VolunteerOpening.create({
            Title:validdata.Title,
            Description:validdata.Description,
            Capacity:validdata.Capacity,
            Benifits:validdata.Benifits,
            Image:Image.public_id
        });
        if(!open){
            return res.status(statuscodes.INTERNALERROR).json(
                new ApiResponse(statuscodes.INTERNALERROR,{},"Internal error while opening the volunteer post")
            )
        }
        res.status(statuscodes.CREATED).json(new ApiResponse(statuscodes.CREATED,open,"Created Successfully"))

    

    } catch (error:any) {
        res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},error.message||"Internal Error while Adding an Volunteer Opening"))
   
    }

    

})

//this will be an put http
export const UpdateOpening=asynchandler(async(req:Request,res:Response)=>{
    const admin=req.admin;
    const {openingid}=req.params;
    let {Title,Description,Capacity,Benifits}=req.body;
    Capacity=Number(Capacity);
    const imagepath=req.file?.path;
    if(!imagepath){
        return res.status(statuscodes.BADREQUEST).json(
            new ApiResponse(statuscodes.BADREQUEST,{},"no image doesn't exists")
        )
    }
    
    try {
        const exist=await User.findById(admin._id)
        if(!exist){
            return res.status(statuscodes.BADREQUEST).json(
                            new ApiResponse(statuscodes.BADREQUEST,{},"Admin doesn't exists")
                        )
        }
        const validdata=OpeningSchema.parse({Title,Description,Capacity,Benifits})
        if(!validdata){
            return res.status(statuscodes.BADREQUEST).json(
                new ApiResponse(statuscodes.BADREQUEST,{},"Incorrect data")
            )
        }
        const existopening=await VolunteerOpening.findById(openingid)
        if(!existopening){
            return res.status(statuscodes.BADREQUEST).json(
                new ApiResponse(statuscodes.BADREQUEST,{},"Opening doesn't exists")
            )
        }
        try {
            
            await removeimagefromcloudinary(existopening.Image)
        } catch (error) {
            return res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Error while updating"))
        }
        
        const newImage=await uploadimageoncloudinary(imagepath);
        if(!newImage){
            return res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Error while updating the image"))
       
        }
                

        const updatedopening=await VolunteerOpening.findByIdAndUpdate(existopening._id,{
            Title:validdata.Title,
            Description:validdata.Description,
            Capacity:validdata.Capacity,
            Benifits:validdata.Benifits,
            Image:newImage.public_id,
        })
        if(!updatedopening){
            return res.status(statuscodes.INTERNALERROR).json(
                new ApiResponse(statuscodes.INTERNALERROR,{},"Internal error while updating")
            )
        }
        res.status(statuscodes.SUCCESFULL).json(new ApiResponse(statuscodes.SUCCESFULL,updatedopening,"Updated Opening Successfully"))


    }
    catch(err){
        return res.status(statuscodes.INTERNALERROR).json(
            new ApiResponse(statuscodes.INTERNALERROR,{},"Internal error while updating")
        )
    }

})

export const DeleteOpening=asynchandler(async(req:Request,res:Response)=>{

    const admin=req.admin;
    const {openingid}=req.params;
    
    
    try {
        const exist=await User.findById(admin._id)
        if(!exist){
            return res.status(statuscodes.NOTFOUND).json(
                            new ApiResponse(statuscodes.NOTFOUND,{},"Admin doesn't exists")
                        )
        }
        const existopening=await VolunteerOpening.findById(openingid);
        if(!existopening){
            return res.status(statuscodes.NOTFOUND).json(
                            new ApiResponse(statuscodes.NOTFOUND,{},"Volunteer Opening doesn't exists")
                        )
        }
        try {
            
            await removeimagefromcloudinary(existopening.Image)
        } catch (error) {
            res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Error while updating"))
        }
        await VolunteerOpening.findByIdAndDelete(existopening._id);
        return res.status(statuscodes.SUCCESFULL).json(new ApiResponse(statuscodes.SUCCESFULL,{},"Opening Deleted Successfully"));

    }
    catch(error){
        return res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Internal Error while Deleting"));

    }
})

export const RegisterVolunteer=asynchandler(async(req:Request,res:Response)=>{
    try {
        const user=req.user;
        const {openingid}=req.params;
        const Resumepath=req.file?.path;
        const existuser=await User.findById(user._id)
        if(!existuser){        
            return res.status(statuscodes.NOTFOUND).json(
            new ApiResponse(statuscodes.NOTFOUND,{},"User doesn't exists")
            )        
        }
        const opening=await VolunteerOpening.findById(openingid);
        if(!opening){        
            return res.status(statuscodes.NOTFOUND).json(
            new ApiResponse(statuscodes.NOTFOUND,{},"Opening doesn't exists")
            )        
        }
        
        if(!Resumepath){
            return res.status(statuscodes.BADREQUEST).json(
                new ApiResponse(statuscodes.BADREQUEST,{},"Incorrect file")
                ) 
        }
        const Resume=await uploadresume(Resumepath);
        if(!Resume.url){
            return res.status(statuscodes.INTERNALERROR).json(
                new ApiResponse(statuscodes.INTERNALERROR,{},"Error while uploading the resume")
                ) 
        }
        const registervolunteer=await VolunteerRegistration.create({
            User:user,
            Opening:opening,
            Resume:Resume.public_id
        })
        if(!registervolunteer){
            return res.status(statuscodes.INTERNALERROR).json(
                new ApiResponse(statuscodes.INTERNALERROR,{},"Error while Registering")
                ) 
        }
        res.status(statuscodes.CREATED).json(new ApiResponse(statuscodes.CREATED,registervolunteer,"Volunteer Registered Successfully"))
        
    } catch (error:any) {
        return res.status(statuscodes.INTERNALERROR).json(
            new ApiResponse(statuscodes.INTERNALERROR,{},error.message || "Internal Server Error")
            ) 
    }

})

export const getallOpenings=asynchandler(async(req:Request,res:Response)=>{
    try {
        
        const volunteeropenings=await VolunteerOpening.find({})
        if(!volunteeropenings){
            return res.status(statuscodes.NOTFOUND).json(new ApiResponse(statuscodes.NOTFOUND,{},"No Openings Found"))
        }
        res.status(statuscodes.SUCCESFULL).json(new ApiResponse(statuscodes.SUCCESFULL,volunteeropenings,"Openings fetched successfully"))

    } catch (error) {
        return res.status(statuscodes.NOTFOUND).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Error fetching openings"))
    }
})
export const getopeningbyId=asynchandler(async(req:Request,res:Response)=>{
   try {
     const {openid}=req.params;
     const existedopening=await VolunteerOpening.findById(openid);
     if(!existedopening){
         return res.status(statuscodes.NOTFOUND).json(new ApiResponse(statuscodes.NOTFOUND,{},"No opening exists"))
     }
     res.status(statuscodes.SUCCESFULL).json(new ApiResponse(statuscodes.SUCCESFULL,existedopening,"Opening fetched Successfully"))
   } catch (error) {
    res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Internal Server Error"))
  
   }
})

export const getApplicants=asynchandler(async(req:Request,res:Response)=>{
   try {
     const {openingid}=req.params;
 
     if(!openingid){
         return res.status(statuscodes.BADREQUEST).json(new ApiResponse(statuscodes.BADREQUEST,{},"Opening Id is required"))
     }
     const existedopening=await VolunteerOpening.findById(openingid);
     if(!existedopening){
         return res.status(statuscodes.NOTFOUND).json(new ApiResponse(statuscodes.NOTFOUND,{},"Opening doesn't exist"))
     }
     const applicants=await VolunteerRegistration.find({Opening:openingid}).populate("User","Name email Phone").populate("Opening","Title Description").exec()
     if(!applicants){
         return res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},"Error while fetching the applicants"));  
     }
     res.status(statuscodes.SUCCESFULL).json(new ApiResponse(statuscodes.SUCCESFULL,applicants,"Applicants are genrated successfully"));
 
   } catch (error:any) {
    res.status(statuscodes.INTERNALERROR).json(new ApiResponse(statuscodes.INTERNALERROR,{},error.message || "Internal Server Error"));
 
   }
})
