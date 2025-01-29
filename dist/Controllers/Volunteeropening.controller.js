"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicants = exports.getopeningbyId = exports.getallOpenings = exports.RegisterVolunteer = exports.DeleteOpening = exports.UpdateOpening = exports.Addopening = void 0;
const asynchandler_1 = require("../utils/asynchandler");
const User_model_1 = require("../models/User.model");
const constants_1 = require("../utils/constants");
const ApiRespnse_1 = require("../utils/ApiRespnse");
const zod_1 = require("zod");
const VolunteerOpening_model_1 = require("../models/VolunteerOpening.model");
const VolunteerRegistration_model_1 = require("../models/VolunteerRegistration.model");
const resumeupload_1 = require("../utils/resumeupload");
const imageupload_1 = require("../utils/imageupload");
const OpeningSchema = zod_1.z.object({
    Title: zod_1.z.string(),
    Description: zod_1.z.string(),
    Capacity: zod_1.z.number(),
    Benifits: zod_1.z.string()
});
exports.Addopening = (0, asynchandler_1.asynchandler)(async (req, res) => {
    const admin = req.admin;
    let { Title, Description, Capacity, Benifits } = req.body;
    Capacity = Number(Capacity);
    const imagepath = req.file?.path;
    const exist = await User_model_1.User.findById(admin._id);
    try {
        if (!exist) {
            return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "Admin doesn't exists"));
        }
        const validdata = OpeningSchema.parse({ Title, Description, Capacity, Benifits });
        if (!validdata || !imagepath) {
            return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "Incorrect data"));
        }
        const Image = await (0, imageupload_1.uploadimageoncloudinary)(imagepath);
        if (!Image) {
            return res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Error while uploading the image"));
        }
        const open = await VolunteerOpening_model_1.VolunteerOpening.create({
            Title: validdata.Title,
            Description: validdata.Description,
            Capacity: validdata.Capacity,
            Benifits: validdata.Benifits,
            Image: Image.public_id
        });
        if (!open) {
            return res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Internal error while opening the volunteer post"));
        }
        res.status(constants_1.statuscodes.CREATED).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.CREATED, open, "Created Successfully"));
    }
    catch (error) {
        res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, error.message || "Internal Error while Adding an Volunteer Opening"));
    }
});
//this will be an put http
exports.UpdateOpening = (0, asynchandler_1.asynchandler)(async (req, res) => {
    const admin = req.admin;
    const { openingid } = req.params;
    let { Title, Description, Capacity, Benifits } = req.body;
    Capacity = Number(Capacity);
    const imagepath = req.file?.path;
    if (!imagepath) {
        return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "no image doesn't exists"));
    }
    try {
        const exist = await User_model_1.User.findById(admin._id);
        if (!exist) {
            return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "Admin doesn't exists"));
        }
        const validdata = OpeningSchema.parse({ Title, Description, Capacity, Benifits });
        if (!validdata) {
            return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "Incorrect data"));
        }
        const existopening = await VolunteerOpening_model_1.VolunteerOpening.findById(openingid);
        if (!existopening) {
            return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "Opening doesn't exists"));
        }
        try {
            await (0, imageupload_1.removeimagefromcloudinary)(existopening.Image);
        }
        catch (error) {
            return res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Error while updating"));
        }
        const newImage = await (0, imageupload_1.uploadimageoncloudinary)(imagepath);
        if (!newImage) {
            return res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Error while updating the image"));
        }
        const updatedopening = await VolunteerOpening_model_1.VolunteerOpening.findByIdAndUpdate(existopening._id, {
            Title: validdata.Title,
            Description: validdata.Description,
            Capacity: validdata.Capacity,
            Benifits: validdata.Benifits,
            Image: newImage.public_id,
        });
        if (!updatedopening) {
            return res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Internal error while updating"));
        }
        res.status(constants_1.statuscodes.SUCCESFULL).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.SUCCESFULL, updatedopening, "Updated Opening Successfully"));
    }
    catch (err) {
        return res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Internal error while updating"));
    }
});
exports.DeleteOpening = (0, asynchandler_1.asynchandler)(async (req, res) => {
    const admin = req.admin;
    const { openingid } = req.params;
    try {
        const exist = await User_model_1.User.findById(admin._id);
        if (!exist) {
            return res.status(constants_1.statuscodes.NOTFOUND).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.NOTFOUND, {}, "Admin doesn't exists"));
        }
        const existopening = await VolunteerOpening_model_1.VolunteerOpening.findById(openingid);
        if (!existopening) {
            return res.status(constants_1.statuscodes.NOTFOUND).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.NOTFOUND, {}, "Volunteer Opening doesn't exists"));
        }
        try {
            await (0, imageupload_1.removeimagefromcloudinary)(existopening.Image);
        }
        catch (error) {
            res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Error while updating"));
        }
        await VolunteerOpening_model_1.VolunteerOpening.findByIdAndDelete(existopening._id);
        return res.status(constants_1.statuscodes.SUCCESFULL).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.SUCCESFULL, {}, "Opening Deleted Successfully"));
    }
    catch (error) {
        return res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Internal Error while Deleting"));
    }
});
exports.RegisterVolunteer = (0, asynchandler_1.asynchandler)(async (req, res) => {
    try {
        const user = req.user;
        const { openingid } = req.params;
        const Resumepath = req.file?.path;
        const existuser = await User_model_1.User.findById(user._id);
        if (!existuser) {
            return res.status(constants_1.statuscodes.NOTFOUND).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.NOTFOUND, {}, "User doesn't exists"));
        }
        const opening = await VolunteerOpening_model_1.VolunteerOpening.findById(openingid);
        if (!opening) {
            return res.status(constants_1.statuscodes.NOTFOUND).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.NOTFOUND, {}, "Opening doesn't exists"));
        }
        if (!Resumepath) {
            return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "Incorrect file"));
        }
        const Resume = await (0, resumeupload_1.uploadresume)(Resumepath);
        if (!Resume.url) {
            return res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Error while uploading the resume"));
        }
        const registervolunteer = await VolunteerRegistration_model_1.VolunteerRegistration.create({
            User: user,
            Opening: opening,
            Resume: Resume.public_id
        });
        if (!registervolunteer) {
            return res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Error while Registering"));
        }
        res.status(constants_1.statuscodes.CREATED).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.CREATED, registervolunteer, "Volunteer Registered Successfully"));
    }
    catch (error) {
        return res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, error.message || "Internal Server Error"));
    }
});
exports.getallOpenings = (0, asynchandler_1.asynchandler)(async (req, res) => {
    try {
        const volunteeropenings = await VolunteerOpening_model_1.VolunteerOpening.find({});
        if (!volunteeropenings) {
            return res.status(constants_1.statuscodes.NOTFOUND).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.NOTFOUND, {}, "No Openings Found"));
        }
        res.status(constants_1.statuscodes.SUCCESFULL).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.SUCCESFULL, volunteeropenings, "Openings fetched successfully"));
    }
    catch (error) {
        return res.status(constants_1.statuscodes.NOTFOUND).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Error fetching openings"));
    }
});
exports.getopeningbyId = (0, asynchandler_1.asynchandler)(async (req, res) => {
    try {
        const { openid } = req.params;
        const existedopening = await VolunteerOpening_model_1.VolunteerOpening.findById(openid);
        if (!existedopening) {
            return res.status(constants_1.statuscodes.NOTFOUND).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.NOTFOUND, {}, "No opening exists"));
        }
        res.status(constants_1.statuscodes.SUCCESFULL).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.SUCCESFULL, existedopening, "Opening fetched Successfully"));
    }
    catch (error) {
        res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Internal Server Error"));
    }
});
exports.getApplicants = (0, asynchandler_1.asynchandler)(async (req, res) => {
    try {
        const { openingid } = req.params;
        if (!openingid) {
            return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "Opening Id is required"));
        }
        const existedopening = await VolunteerOpening_model_1.VolunteerOpening.findById(openingid);
        if (!existedopening) {
            return res.status(constants_1.statuscodes.NOTFOUND).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.NOTFOUND, {}, "Opening doesn't exist"));
        }
        const applicants = await VolunteerRegistration_model_1.VolunteerRegistration.find({ Opening: openingid }).populate("User", "Name email Phone").populate("Opening", "Title Description").exec();
        if (!applicants) {
            return res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Error while fetching the applicants"));
        }
        res.status(constants_1.statuscodes.SUCCESFULL).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.SUCCESFULL, applicants, "Applicants are genrated successfully"));
    }
    catch (error) {
        res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, error.message || "Internal Server Error"));
    }
});
