import { verifyJWT } from "../middlewares/auth.middleware";
import { Router } from "express";
import { videoViews } from "../controllers/views.controllers";

const router = Router()
router.use(verifyJWT)

router.route("/:videoId").get(videoViews)
export default router