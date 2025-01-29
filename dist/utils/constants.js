"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defexpiry = exports.AssignmentStatus = exports.statuscodes = exports.DB_NAME = void 0;
exports.DB_NAME = "jaruratngo";
var statuscodes;
(function (statuscodes) {
    statuscodes[statuscodes["NOTFOUND"] = 404] = "NOTFOUND";
    statuscodes[statuscodes["SUCCESFULL"] = 200] = "SUCCESFULL";
    statuscodes[statuscodes["INTERNALERROR"] = 500] = "INTERNALERROR";
    statuscodes[statuscodes["BADREQUEST"] = 400] = "BADREQUEST";
    statuscodes[statuscodes["CREATED"] = 201] = "CREATED";
})(statuscodes || (exports.statuscodes = statuscodes = {}));
var AssignmentStatus;
(function (AssignmentStatus) {
    AssignmentStatus["success"] = "success";
    AssignmentStatus["failed"] = "failed";
})(AssignmentStatus || (exports.AssignmentStatus = AssignmentStatus = {}));
var defexpiry;
(function (defexpiry) {
    defexpiry[defexpiry["access"] = 5184000] = "access";
    defexpiry[defexpiry["refresh"] = 51840000] = "refresh";
})(defexpiry || (exports.defexpiry = defexpiry = {}));
