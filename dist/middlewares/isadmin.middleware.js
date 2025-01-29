"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isadmin = void 0;
const asynchandler_1 = require("../utils/asynchandler");
const constants_1 = require("../utils/constants");
const ApiRespnse_1 = require("../utils/ApiRespnse");
exports.isadmin = (0, asynchandler_1.asynchandler)(async (req, res, next) => {
    const user = req.admin;
    if (!user) {
        return res.status(constants_1.statuscodes.BADREQUEST).json(new ApiRespnse_1.ApiResponse(constants_1.statuscodes.BADREQUEST, {}, "Not authorized to access the admin page"));
    }
    next();
});
