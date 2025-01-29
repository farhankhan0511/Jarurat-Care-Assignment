import { Router } from "express";
import { UserRegistration,LoginUser,DeleteUser,UpdateUserphone,changeCurrentPassword, } from "../Controllers/User.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router=Router();
router.route("/register").post(UserRegistration);
router.route("/login").post(LoginUser);
router.route("/delete").delete(verifyJWT,DeleteUser);
router.route("/updatephone").patch(verifyJWT,UpdateUserphone);
router.route("/changepassword").patch(verifyJWT,changeCurrentPassword)

export default router;