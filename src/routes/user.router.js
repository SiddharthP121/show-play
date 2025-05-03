import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvtar,
  updateCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avtar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//Secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(changeCurrentPassword);
router.route("get-user").post(getCurrentUser);
router.route("/update-account-details").post(updateAccountDetails);
router.route("/update-avtar").post(
  upload.fields({
    name: "avtar",
    maxCount: 1,
  }),
  updateAvtar
);
router.route("/update-coverimage").post(upload.fields({
    name: "coverImage",
    maxCount: 1
}) ,updateCoverImage)

export default router;
