"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerOpening = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const VolunteerOpeningSchema = new mongoose_1.default.Schema({
    Title: {
        type: String,
        required: [true, "Title is required"],
        unique: true,
        trim: true,
    },
    Description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        maxLength: [500, "Description must be less than 500 characters"]
    },
    Capacity: {
        type: Number,
        required: [true, "Capacity is required"],
    },
    Image: {
        type: String,
        required: true,
    },
    Benifits: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.VolunteerOpening = mongoose_1.default.model("VolunteerOpening", VolunteerOpeningSchema);
