"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBCONNECT = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../utils/constants");
const DBCONNECT = async () => {
    try {
        const connection = await mongoose_1.default.connect(`${process.env.MONGODB_URI}/${constants_1.DB_NAME}`);
        console.log(connection.connection.host);
    }
    catch (error) {
        console.error("Error while connecting to the database", error);
        process.exit(1);
    }
};
exports.DBCONNECT = DBCONNECT;
