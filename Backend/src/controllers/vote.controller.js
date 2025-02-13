import mongoose from "mongoose"
import {Vote} from "../models/vote.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Post } from "../models/post.model.js"
import { Comment } from "../models/comment.model.js"

const togglePostVote = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { voteType } = req.body;

    const existingVote = await Vote.findOne({
        post: postId,
        votedBy: req.user._id
    });

    if (existingVote) {
        if (existingVote.voteType === voteType) {
            // Remove vote if same type clicked again
            await Vote.findByIdAndDelete(existingVote._id);
            return res.status(200).json(
                new ApiResponse(200, null, "Vote removed")
            );
        } else {
            // Update vote type if different
            existingVote.voteType = voteType;
            await existingVote.save();
            return res.status(200).json(
                new ApiResponse(200, existingVote, "Vote updated")
            );
        }
    }

    // Create new vote
    const newVote = await Vote.create({
        post: postId,
        votedBy: req.user._id,
        voteType: voteType
    });

    return res.status(201).json(
        new ApiResponse(201, newVote, "Vote added")
    );
});

const getPostVoteCount = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    
    const counts = await Vote.aggregate([
        { $match: { post: new mongoose.Types.ObjectId(postId) } },
        { $group: {
            _id: null,
            upvotes: { $sum: { $cond: [{ $eq: ["$voteType", "up"] }, 1, 0] } },
            downvotes: { $sum: { $cond: [{ $eq: ["$voteType", "down"] }, 1, 0] } }
        }},
        { $project: {
            total: { $subtract: ["$upvotes", "$downvotes"] },
            upvotes: 1,
            downvotes: 1
        }}
    ]);

    const result = counts[0] || { total: 0, upvotes: 0, downvotes: 0 };
    return res.status(200).json(
        new ApiResponse(200, result, "Vote count retrieved")
    );
});

const toggleCommentVote = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { voteType } = req.body;

    // Validate voteType
    if (!voteType || !['up', 'down'].includes(voteType)) {
        throw new ApiError(400, "Valid voteType (up/down) is required");
    }

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
                post: { $exists: true, $ne: null } //Votes that reference valid posts (checks post field exists and isn't null)
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
}) /*

example response
{
    _id: "vote_id",
    votedBy: "user_id",
    post: "post_id",
    postDetails: { / full post object * }
}*/

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

