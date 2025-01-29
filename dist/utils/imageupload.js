"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeimagefromcloudinary = exports.uploadimageoncloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadimageoncloudinary = async (localpath) => {
    try {
        if (!localpath)
            return null;
        const response = await cloudinary_1.v2.uploader.upload(localpath, { resource_type: "image" });
        console.log("image is uploaded on cloudinary", response.url);
        if (fs_1.default.existsSync(localpath)) {
            fs_1.default.unlinkSync(localpath); // Ensure the file exists before deleting it
        }
        return response;
    }
    catch (error) {
        if (fs_1.default.existsSync(localpath)) {
            fs_1.default.unlinkSync(localpath); // Ensure the file exists before deleting it
        }
        return null;
    }
};
exports.uploadimageoncloudinary = uploadimageoncloudinary;
const removeimagefromcloudinary = async (publicid) => {
    try {
        await cloudinary_1.v2.uploader.destroy(publicid, { resource_type: "image" });
        return "Deleted";
    }
    catch (err) {
        return err.message || "Error deleting the image";
    }
};
exports.removeimagefromcloudinary = removeimagefromcloudinary;
