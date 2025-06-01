import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { videoViews } from "../controllers/views.controllers.js";

const router = Router()
router.use(verifyJWT)

router.route("/:videoId").get(videoViews)
export default router