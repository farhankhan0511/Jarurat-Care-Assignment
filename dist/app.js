"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ limit: "16kb", extended: true }));
app.use(express_1.default.static("public"));
const User_routes_1 = __importDefault(require("./routes/User.routes"));
const Volunteer_routes_1 = __importDefault(require("./routes/Volunteer.routes"));
app.use("/user", User_routes_1.default);
app.use("/volunteer", Volunteer_routes_1.default);
exports.default = app;
