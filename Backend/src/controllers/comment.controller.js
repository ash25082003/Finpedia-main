import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// CREATE: Create a new comment
const createComment = asyncHandler(async (req, res, next) => {
    const { content, postId, parentCommentId } = req.body;

    // Validate inputs
    if (!content || !postId) {
        throw new ApiError(400, "Content and Post ID are required");
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    // Create a new comment
    const newComment = await Comment.create({
        content,
        userId: req.user._id, // Assuming the user is authenticated
        postId,
        parentCommentId,
    });

    res.status(201).json(new ApiResponse(201, newComment, "Comment created successfully"));
});

// UPDATE: Update a comment by ID
const updateComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { content, status } = req.body;

    // Validate Comment ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Comment ID");
    }

    // Update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { content, status },
        { new: true }
    );

    if (!updatedComment) {
        throw new ApiError(404, "Comment not found");
    }

    res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

// DELETE: Delete a comment by ID
const deleteComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Validate Comment ID
    if (!id || !mongoose.isValidObjectId(id)) {  // Use helper method for validation
        throw new ApiError(400, "Invalid Comment ID");
    }

    // Convert string ID to ObjectId
    const commentId = new mongoose.Types.ObjectId(id);  // Proper instantiation

    const commentTree = await Comment.aggregate([
        { 
            $match: { 
                _id: commentId  // Use pre-converted ObjectId
            } 
        },
        {
            $graphLookup: {
                from: "comments",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parentCommentId",
                as: "descendants",
                depthField: "depth"
            }
        },
        { 
            $project: { 
                allIds: { 
                    $concatArrays: [["$_id"], "$descendants._id"] 
                } 
            } 
        }
    ]);
    console.log(commentTree)

    if (commentTree.length === 0) {
        throw new ApiError(404, "Comment not found");
    }

    const commentIds = commentTree[0].allIds;

    const updateResult = await Comment.updateMany(
        { _id: { $in: commentIds } },
        { $set: { status: 'deleted' } }
    );

    res.status(200).json(
        new ApiResponse(200, null, `Deleted ${updateResult.modifiedCount} comments`)
    );
});




// GET: Get a comment by ID
const getCommentById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Validate Comment ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Comment ID");
    }

    // Fetch the comment
    const comment = await Comment.findById(id)
        .populate("userId", "fullName email") // Optional: Populate user details
        .populate("postId", "title") // Optional: Populate post details
        .populate("parentCommentId", "content"); // Optional: Populate parent comment

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    res.status(200).json(new ApiResponse(200, comment, "Comment fetched successfully"));
});

// GET: Get all comments for a post
const getCommentsByPostId = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;

    // Validate Post ID
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    // Fetch comments for the post
    const comments = await Comment.find({ postId, status: "active" })
        .populate("userId", "fullName email") // Optional: Populate user details
        .sort({ createdAt: -1 });

    
    res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

export { createComment, updateComment, deleteComment, getCommentById, getCommentsByPostId };
