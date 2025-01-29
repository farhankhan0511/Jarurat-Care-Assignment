import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  })

export const uploadresume=async(localpath:string):Promise<any>=>{
     try {
            if(!localpath)return null;
            const response=await cloudinary.uploader.upload(localpath,{folder:"resumes",resource_type:"auto"})
            console.log("image is uploaded on cloudinary",response.url)
            fs.unlinkSync(localpath)
            return response;
            
            
        } catch (error) {
            fs.unlinkSync(localpath)
            return null;
        }
}
export const removeresume=async(publicid:string):Promise<string>=>{
    try{
        await cloudinary.uploader.destroy(publicid,{resource_type:"auto"}) // on calling the function i have to give foldername i.e resumes/publicid 
        return "Deleted"
    }
    catch(err:any){
        return err.message|| "Error deleting the image"
    }
}