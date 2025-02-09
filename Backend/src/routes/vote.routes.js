import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    togglePostVote,
    toggleCommentVote,
    getVotedPosts,
    getVotedComments,
    getPostVoteCount,
    getCommentVoteCount
} from "../controllers/vote.controller.js"

const router = Router();

// Protected routes (require authentication)
router.route("/toggle/post/:postId").post(verifyJWT, togglePostVote);
router.route("/toggle/comment/:commentId").post(verifyJWT, toggleCommentVote);
router.route("/posts").get(verifyJWT, getVotedPosts);
router.route("/comments").get(verifyJWT, getVotedComments);

// Public routes (no authentication needed)
router.route("/count/post/:postId").get(getPostVoteCount);
router.route("/count/comment/:commentId").get(getCommentVoteCount);

export default router;
