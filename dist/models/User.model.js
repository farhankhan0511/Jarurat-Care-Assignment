"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.roles = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../utils/constants");
const ApiRespnse_1 = require("../utils/ApiRespnse");
var roles;
(function (roles) {
    roles["admin"] = "admin";
    roles["user"] = "user";
})(roles || (exports.roles = roles = {}));
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        lowercase: true,
        required: [true, "username is required"],
        unique: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: Object.values(roles),
        required: true
    },
    Name: {
        type: String,
        required: true,
        trim: true,
    },
    Phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshtoken: {
        type: String
    }
}, { timestamps: true });
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt_1.default.hash(this.password, 10);
    next();
});
UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt_1.default.compare(password, this.password);
};
UserSchema.methods.generateaccesstoken = async function () {
    const accesstoken = process.env.ACCESS_TOKEN_SECRET;
    const expiry = Number(process.env.ACCESS_TOKEN_EXPIRY) || constants_1.defexpiry.access;
    const options = { expiresIn: expiry };
    if (!accesstoken) {
        return new ApiRespnse_1.ApiResponse(500, {}, "Access token is invalid");
    }
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        role: this.role
    }, accesstoken, options);
};
UserSchema.methods.generaterefreshtoken = async function () {
    const refreshtoken = process.env.REFRESH_TOKEN_SECRET;
    const rexpiry = Number(process.env.REFRESH_TOKEN_EXPIRY) || constants_1.defexpiry.refresh;
    // Handle expiry conversion using ms library
    const options = {
        expiresIn: rexpiry
    };
    if (!refreshtoken) {
        return new ApiRespnse_1.ApiResponse(500, {}, "Access token is invalid");
    }
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        role: this.role
    }, refreshtoken, options);
};
exports.User = mongoose_1.default.model("User", UserSchema);
