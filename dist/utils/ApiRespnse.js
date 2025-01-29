"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    statuscode;
    data;
    message;
    constructor(statuscode, data, message) {
        this.statuscode = statuscode;
        this.data = data;
        this.message = message;
    }
}
exports.ApiResponse = ApiResponse;
