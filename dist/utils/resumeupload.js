"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeresume = exports.uploadresume = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadresume = async (localpath) => {
    try {
        if (!localpath)
            return null;
        const response = await cloudinary_1.v2.uploader.upload(localpath, { folder: "resumes", resource_type: "auto" });
        console.log("image is uploaded on cloudinary", response.url);
        fs_1.default.unlinkSync(localpath);
        return response;
    }
    catch (error) {
        fs_1.default.unlinkSync(localpath);
        return null;
    }
};
exports.uploadresume = uploadresume;
const removeresume = async (publicid) => {
    try {
        await cloudinary_1.v2.uploader.destroy(publicid, { resource_type: "auto" }); // on calling the function i have to give foldername i.e resumes/publicid 
        return "Deleted";
    }
    catch (err) {
        return err.message || "Error deleting the image";
    }
};
exports.removeresume = removeresume;
