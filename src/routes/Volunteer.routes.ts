import { Router } from "express";
import { Addopening,DeleteOpening,UpdateOpening,getallOpenings,getopeningbyId,getApplicants,RegisterVolunteer} from "../Controllers/Volunteeropening.controller";
import { isadmin } from "../middlewares/isadmin.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router=Router();

router.route("/add").post(verifyJWT,isadmin,upload.single("Image"),Addopening);
router.route("/delete/:openingid").delete(verifyJWT,isadmin,DeleteOpening);
router.route("/update/:openingid").put(verifyJWT,isadmin,upload.single("Image"),UpdateOpening);
router.route("/all").get(verifyJWT,getallOpenings)
router.route("/get/:openid").get(getopeningbyId)
router.route("/getapplicants/:openingid").get(verifyJWT,isadmin,getApplicants)
router.route("/register/:openingid").post(verifyJWT,upload.single("Resume"),RegisterVolunteer)

export default router;