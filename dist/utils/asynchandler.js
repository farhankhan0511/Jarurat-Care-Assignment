"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asynchandler = void 0;
const asynchandler = (requesthandler) => {
    return (req, res, next) => {
        Promise.resolve(requesthandler(req, res, next)).catch((err) => next(err));
    };
};
exports.asynchandler = asynchandler;
