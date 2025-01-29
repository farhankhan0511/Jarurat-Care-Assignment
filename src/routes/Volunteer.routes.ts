import { Router } from "express";
import { Addopening,DeleteOpening,UpdateOpening,getallOpenings,getopeningbyId,getApplicants } from "../Controllers/Volunteeropening.controller";
import { isadmin } from "../middlewares/isadmin.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router=Router();

router.route("/add").post(verifyJWT,isadmin,upload.single("Image"),Addopening);
router.route("/delete").delete(verifyJWT,isadmin,DeleteOpening);
router.route("/update").put(verifyJWT,isadmin,upload.single("Image"),UpdateOpening);
router.route("/all").get(verifyJWT,isadmin,getallOpenings)
router.route("/get/:id").get(getopeningbyId)
router.route("/getapplicants").get(verifyJWT,isadmin,getApplicants)

export default router;