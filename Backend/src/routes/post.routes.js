import { Router } from "express";
import {
    createPost,
    updatePost,
    deletePost,
    getPostById,
    getAllPosts,
    getPostsByIndustryId
} from "../controllers/post.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// CREATE: Create a new post
router.route("/").post(verifyJWT , createPost);

// UPDATE: Update a post by ID
router.route("/:id").put( verifyJWT , updatePost);

// DELETE: Delete a post by ID
router.route("/:id").delete(deletePost);

// GET: Get a post by ID
router.route("/:id").get(getPostById);

// GET: Get all posts
router.route("/").get(getAllPosts);

// GET: Get posts by industry ID
router.route("/industry/:industryId").get(getPostsByIndustryId);

export default router;
