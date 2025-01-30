"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const db_1 = require("./db/db");
(0, db_1.DBCONNECT)()
    .then(() => {
    app_1.default.listen(process.env.PORT || 8080, () => {
        console.log("server is running");
    });
})
    .catch((err) => console.log("Mongodb not connected", err));
