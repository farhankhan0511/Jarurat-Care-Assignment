import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  })

export const uploadimageoncloudinary=async(localpath:string):Promise<any>=>{
    try {
        if(!localpath)return null;
        const response=await cloudinary.uploader.upload(localpath,{resource_type:"image"})
        console.log("image is uploaded on cloudinary",response.url)
        if (fs.existsSync(localpath)) {
            fs.unlinkSync(localpath);  // Ensure the file exists before deleting it
        }
        return response;
        
        
    } catch (error) {
        if (fs.existsSync(localpath)) {
            fs.unlinkSync(localpath);  // Ensure the file exists before deleting it
        }
        return null;
    }
}
export const removeimagefromcloudinary=async(publicid:string):Promise<any>=>{
    try{
        await cloudinary.uploader.destroy(publicid,{resource_type:"image"})
        return "Deleted"
    }
    catch(err:any){
        return err.message|| "Error deleting the image"
    }

}