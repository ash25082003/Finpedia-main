import mongoose from "mongoose"
import {Vote} from "../models/vote.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Post } from "../models/post.model.js"
import { Comment } from "../models/comment.model.js"

const togglePostVote = asyncHandler(async (req, res) => {
    const {postId} = req.params

    const post = await Post.findById(postId)
    if(!post) {
        throw new ApiError(404, "Post not found")
    }

    const voteStatus = await Vote.aggregate([
        {
            $match: {
                post: new mongoose.Types.ObjectId(postId),
                votedBy: new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])

    if(voteStatus.length === 0) {
        const newVote = await Vote.create({
            post: postId,
            votedBy: req.user._id
        })
        return res.status(200).json(
            new ApiResponse(200, newVote, "Post voted successfully")
        )
    } else {
        const removedVote = await Vote.deleteOne({
            post: postId,
            votedBy: req.user._id
        })
        return res.status(200).json(
            new ApiResponse(200, removedVote, "Vote removed from post")
        )
    }
})

const toggleCommentVote = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    const comment = await Comment.findById(commentId)
    if(!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const voteStatus = await Vote.aggregate([
        {
            $match: {
                comment: new mongoose.Types.ObjectId(commentId),
                votedBy: new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])

    if(voteStatus.length === 0) {
        const newVote = await Vote.create({
            comment: commentId,
            votedBy: req.user._id
        })
        return res.status(200).json(
            new ApiResponse(200, newVote, "Comment voted successfully")
        )
    } else {
        const removedVote = await Vote.deleteOne({
            comment: commentId,
            votedBy: req.user._id
        }
        )
        return res.status(200).json(
            new ApiResponse(200, removedVote, "Vote removed from comment")
        )
    }
})

const getVotedPosts = asyncHandler(async (req, res) => {
    const votedPosts = await Vote.aggregate([
        {
            $match: {
                votedBy: new mongoose.Types.ObjectId(req.user._id),
                post: { $exists: true, $ne: null }
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "post",
                foreignField: "_id",
                as: "postDetails"
            }
        },
        {
            $unwind: "$postDetails"
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, votedPosts, "Voted posts fetched successfully")
    )
})

const getVotedComments = asyncHandler(async (req, res) => {
    const votedComments = await Vote.aggregate([
        {
            $match: {
                votedBy: new mongoose.Types.ObjectId(req.user._id),
                comment: { $exists: true, $ne: null }
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "comment",
                foreignField: "_id",
                as: "commentDetails"
            }
        },
        {
            $unwind: "$commentDetails"
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, votedComments, "Voted comments fetched successfully")
    )
})

// Add these two new controller functions
const getPostVoteCount = asyncHandler(async (req, res) => {
    const {postId} = req.params
    
    const post = await Post.findById(postId)
    if(!post) {
        throw new ApiError(404, "Post not found")
    }

    const voteCount = await Vote.countDocuments({
        post: postId
    })

    return res.status(200).json(
        new ApiResponse(200, { count: voteCount }, "Post vote count retrieved successfully")
    )
})

const getCommentVoteCount = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    const comment = await Comment.findById(commentId)
    if(!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const voteCount = await Vote.countDocuments({
        comment: commentId
    })

    return res.status(200).json(
        new ApiResponse(200, { count: voteCount }, "Comment vote count retrieved successfully")
    )
})

// Update the export statement
export {
    togglePostVote,
    toggleCommentVote,
    getVotedPosts,
    getVotedComments,
    getPostVoteCount,
    getCommentVoteCount
}

