"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const asynchandler_1 = require("../utils/asynchandler");
const ApiRespnse_1 = require("../utils/ApiRespnse");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = require("../models/User.model");
exports.verifyJWT = (0, asynchandler_1.asynchandler)(async (req, res, next) => {
    try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return new ApiRespnse_1.ApiResponse(404, {}, "Unauthorized Request");
        }
        const accesstoken = process.env.ACCESS_TOKEN_SECRET;
        if (!accesstoken) {
            return new ApiRespnse_1.ApiResponse(404, {}, "Unauthorized Request");
        }
        const decoded = await jsonwebtoken_1.default.verify(token, accesstoken);
        const user = await User_model_1.User.findById(decoded._id).select("-password -refreshtoken");
        if (!user) {
            return new ApiRespnse_1.ApiResponse(402, {}, "Invalid access token");
        }
        if (user.role == "user") {
            req.user = user;
        }
        else {
            req.admin = user;
        }
        next();
    }
    catch (err) {
        return new ApiRespnse_1.ApiResponse(404, {}, "Invalid accesstoken");
    }
});
