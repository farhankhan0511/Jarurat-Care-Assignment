"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_controller_1 = require("../Controllers/User.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.route("/register").post(User_controller_1.UserRegistration);
router.route("/login").post(User_controller_1.LoginUser);
router.route("/delete").delete(auth_middleware_1.verifyJWT, User_controller_1.DeleteUser);
router.route("/updatephone").patch(auth_middleware_1.verifyJWT, User_controller_1.UpdateUserphone);
router.route("/changepassword").patch(auth_middleware_1.verifyJWT, User_controller_1.changeCurrentPassword);
exports.default = router;
