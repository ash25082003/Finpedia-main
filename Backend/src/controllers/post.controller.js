import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";


// CREATE: Create a new post
const createPost = asyncHandler(async (req, res, next) => {
    const { title, content,  industryId, status } = req.body;
    console.log(req.body)
    // Validate inputs
    console.log(req.user._id)
    if (!title || !content  || !industryId) {
        throw new ApiError(400, "Title, Content, User ID, and Industry ID are required");
    }

    // Create a new post
    const newPost = await Post.create({
        title,
        content,
        userId: req.user._id,
        industryId,
        status
    });

    res.status(201).json(new ApiResponse(201, newPost, "Post created successfully"));
});

// UPDATE: Update a post by ID
// Backend updatePost controller (additional security)
const updatePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?._id; // Assuming authenticated user
    console.log(userId)

    // Validate Post ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    // Check ownership
    const post = await Post.findById(id);
    if (!post) throw new ApiError(404, "Post not found");
    if (!post.userId.equals(userId)) throw new ApiError(403, "Unauthorized");

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(id, updates, { 
        new: true,
        runValidators: true
    });

    res.status(200).json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

// DELETE: Delete a post by ID
const deletePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Validate Post ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    // Delete the post
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
        throw new ApiError(404, "Post not found");
    }

    res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});

// GET: Get a post by ID
const getPostById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Validate Post ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    // Fetch the post
const post = await Post.findById(id).populate('userId');

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    res.status(200).json(new ApiResponse(200, post, "Post fetched successfully"));
});

// GET: Get all posts
const getAllPosts = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = { status: 'active' }; // Only fetch active posts

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
            { 'userId.fullName': { $regex: search, $options: 'i' } }
        ];
    }

    const posts = await Post.find(query)
        .populate('userId')
        .skip((page - 1) * limit)
        .limit(limit);

    res.status(200).json(new ApiResponse(200, posts, "Posts fetched"));
});



// GET: Get posts by industry ID
const getPostsByIndustryId = asyncHandler(async (req, res, next) => {
    const { industryId } = req.params;

    // Validate Industry ID
    if (!industryId || !mongoose.Types.ObjectId.isValid(industryId)) {
        throw new ApiError(400, "Invalid Industry ID");
    }

    // Fetch posts by industry
    const posts = await Post.find({ industryId });

    if (!posts.length) {
        throw new ApiError(404, "No posts found for this industry");
    }

    res.status(200).json(new ApiResponse(200, posts, "Posts by industry fetched successfully"));
});

export { createPost, updatePost, deletePost, getPostById, getAllPosts, getPostsByIndustryId };
