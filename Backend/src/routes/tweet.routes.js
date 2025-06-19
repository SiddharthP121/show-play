import { Router } from 'express';
import {
    createTweet,
    getAllHotThoughts,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/say").post(verifyJWT, createTweet);
router.route("/messages").get(verifyJWT, getAllHotThoughts);
router.route("/user/thoughts").get(verifyJWT, getUserTweets);
router.route("/:thoughtId").patch(updateTweet).delete(deleteTweet);

export default router