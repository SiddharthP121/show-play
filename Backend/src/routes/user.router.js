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
  userChannelProfile,
  getWatchHistory,
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

router.route("/login").post(upload.none(), loginUser);

//Secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/profile").get(verifyJWT, getCurrentUser);
router.route("/update-account-details").patch(verifyJWT, upload.none(), updateAccountDetails);
router
  .route("/update-avtar")
  .patch(verifyJWT, upload.single("avtar"), updateAvtar);
router
  .route("/update-coverimage")
  .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/channel-profile/:username").get(verifyJWT, userChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;