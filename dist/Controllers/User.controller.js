"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCurrentPassword = exports.UpdateUserphone = exports.DeleteUser = exports.LoginUser = exports.UserRegistration = void 0;
const asynchandler_1 = require("../utils/asynchandler");
const zod_1 = require("zod");
const constants_1 = require("../utils/constants");
const User_model_1 = require("../models/User.model");
const ApiRespnse_1 = require("../utils/ApiRespnse");
const RegistrationSchema = zod_1.z.object({
    Name: zod_1.z.string(),
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    Phone: zod_1.z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must not exceed 15 digits").regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format"),
    password: zod_1.z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one digit"),
});
const LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one digit")
});
exports.UserRegistration = (0, asynchandler_1.asynchandler)(async (req, res) => {
    let validdata;
    try {
        validdata = RegistrationSchema.parse(req.body);
    }
    catch (err) {
        return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, err.message || "bad request"));
    }
    const existuser = await User_model_1.User.findOne({ email: validdata.email });
    if (existuser) {
        return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "User already exists"));
    }
    const user = await User_model_1.User.create({
        Name: validdata.Name,
        username: validdata.username,
        Phone: validdata.Phone,
        email: validdata.email,
        password: validdata.password,
        role: User_model_1.roles.user
    });
    if (!user) {
        return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Error while registration of the partenr"));
    }
    return res.status(constants_1.statuscodes.SUCCESFULL).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.CREATED, user, "User registered Successfullly"));
});
const generateaccessandrefreshtoken = async (user_Id) => {
    const user = await User_model_1.User.findById(user_Id);
    if (!user) {
        throw new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Error while generating tokens");
    }
    const accesstoken = await user.generateaccesstoken();
    const refreshtoken = await user.generaterefreshtoken();
    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });
    return { accesstoken, refreshtoken };
};
exports.LoginUser = (0, asynchandler_1.asynchandler)(async (req, res) => {
    const { email, password } = req.body;
    let validlogin;
    try {
        validlogin = LoginSchema.parse({ email: email, password: password });
    }
    catch (err) {
        return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "Email and password should be in format"));
    }
    const user = await User_model_1.User.findOne({ email: validlogin.email });
    if (!user) {
        return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "User doesn't exists"));
    }
    let validpass = await user.isPasswordCorrect(validlogin.password);
    if (!validpass) {
        return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "Incorrect Password"));
    }
    const { accesstoken, refreshtoken } = await generateaccessandrefreshtoken(user._id);
    const loggedinuser = await User_model_1.User.findById(user._id).select("-password -refreshtoken");
    const options = {
        httpOnly: true,
        secure: false,
    };
    res.status(constants_1.statuscodes.SUCCESFULL)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.SUCCESFULL, { loggedinuser, accesstoken, refreshtoken }, "user logged in successfully"));
});
exports.DeleteUser = (0, asynchandler_1.asynchandler)(async (req, res) => {
    const userid = req.user;
    try {
        const existeduser = await User_model_1.User.findById(userid);
        if (!existeduser) {
            return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "User doesn't exists"));
        }
        await User_model_1.User.findByIdAndDelete(existeduser._id);
        res.status(constants_1.statuscodes.SUCCESFULL).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.SUCCESFULL, {}, "User Deleted Succesfully"));
    }
    catch (error) {
        res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Internal Error while deleting the user"));
    }
});
exports.UpdateUserphone = (0, asynchandler_1.asynchandler)(async (req, res) => {
    const user = req.user;
    const { phone } = req.body;
    try {
        const existeduser = await User_model_1.User.findById(user._id);
        if (!existeduser) {
            return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "User doesn't exists"));
        }
        await User_model_1.User.findByIdAndUpdate(existeduser._id, { $set: { phone: phone } }, { new: true });
        res.status(constants_1.statuscodes.SUCCESFULL).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.SUCCESFULL, {}, "Phone Updated Succesfully"));
    }
    catch (error) {
        res.status(constants_1.statuscodes.INTERNALERROR).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.INTERNALERROR, {}, "Internal Error while updating the user"));
    }
});
exports.changeCurrentPassword = (0, asynchandler_1.asynchandler)(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User_model_1.User.findById(req.user?._id);
    if (!user) {
        return res.status(constants_1.statuscodes.NOTFOUND).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.NOTFOUND, {}, "No user Found"));
    }
    const isPassword = await user.isPasswordCorrect(oldPassword);
    if (!isPassword) {
        return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "Incorrect Password"));
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(constants_1.statuscodes.SUCCESFULL).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.SUCCESFULL, {}, "Password Changed Successfully"));
});
