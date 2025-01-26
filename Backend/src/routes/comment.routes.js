import express from "express";
import {
    createComment,
    updateComment,
    deleteComment,
    getCommentById,
    getCommentsByPostId,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route to create a new comment
router.post("/", verifyJWT , createComment);

// Route to update a comment by ID
router.put("/:id", verifyJWT , updateComment);

// Route to delete a comment by ID
router.delete("/:id", verifyJWT , deleteComment);

// Route to get a comment by ID
router.get("/:id", getCommentById);

// Route to get all comments for a specific post
router.get("/post/:postId", getCommentsByPostId);

export default router;
