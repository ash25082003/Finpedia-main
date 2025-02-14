import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import {
  getCommentsByPostId,
  createComment,
  deleteComment,
  toggleCommentVote,
  getCommentVoteCount,
  getVotedComments,
} from "../../Backend/config";
import {
  MessageSquare,
  Reply,
  Trash,
  ChevronDown,
  MoreVertical,
  ArrowBigUp,
  ArrowBigDown,
  ChevronRight,
} from "lucide-react";

export const CommentSection = ({ postId, initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [userVoteDirection, setUserVoteDirection] = useState(new Map());
  const [commentVotes, setCommentVotes] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [expandedComments, setExpandedComments] = useState([]);

  const userInfo = useSelector((state) => state.auth.userData?.data);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuId &&
        !buttonRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);
  const toggleCommentExpansion = (commentId) => {
    setExpandedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const fetchComments = async () => {
    try {
      const response = await getCommentsByPostId({ postId });
      if (response.statusCode === 200) {
        setComments(response.data);
        const votesData = {};
        for (const comment of response.data) {
          const voteResponse = await getCommentVoteCount(comment._id);
          votesData[comment._id] = voteResponse.data || {
            upvotes: 0,
            downvotes: 0,
            total: 0,
          };
        }
        setCommentVotes(votesData);
      } else {
        setError(response.message || "Failed to fetch comments");
      }
    } catch (error) {
      setError("Failed to fetch comments. Please try again later.");
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVotedComments = async () => {
      try {
        const response = await getVotedComments();
        if (response.statusCode === 200) {
          const votesMap = new Map(
            response.data.map((vote) => [
              vote.commentDetails._id,
              vote.voteType,
            ])
          );
          setUserVoteDirection(votesMap);
        }
      } catch (error) {
        console.error("Error fetching voted comments:", error);
      }
    };

    if (userInfo) fetchVotedComments();
    if (!initialComments.length) fetchComments();
  }, [postId, userInfo]);

  const handleVote = async (commentId, direction) => {
    if (!userInfo) return;

    const previousVote = userVoteDirection.get(commentId);
    const previousCounts = commentVotes[commentId] || {
      upvotes: 0,
      downvotes: 0,
      total: 0,
    };

    const newCounts = { ...previousCounts };
    let newVoteState = null;

    if (previousVote === direction) {
      newCounts[direction + "votes"] -= 1;
      newVoteState = null;
    } else {
      if (previousVote) {
        newCounts[previousVote + "votes"] -= 1;
      }
      newCounts[direction + "votes"] += 1;
      newVoteState = direction;
    }
    newCounts.total = newCounts.upvotes - newCounts.downvotes;

    setUserVoteDirection((prev) => new Map(prev).set(commentId, newVoteState));
    setCommentVotes((prev) => ({ ...prev, [commentId]: newCounts }));

    try {
      await toggleCommentVote(commentId, direction);
      const countRes = await getCommentVoteCount(commentId);
      setCommentVotes((prev) => ({
        ...prev,
        [commentId]: countRes.data,
      }));
    } catch (error) {
      setUserVoteDirection((prev) =>
        new Map(prev).set(commentId, previousVote)
      );
      setCommentVotes((prev) => ({ ...prev, [commentId]: previousCounts }));
      console.error("Voting failed:", error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const response = await createComment({
        content: newComment,
        postId,
        parentCommentId: replyTo,
      });
      if (response.statusCode === 201) {
        setNewComment("");
        setReplyTo(null);
        await fetchComments();
      } else {
        setError(response.message || "Failed to create comment");
      }
    } catch (error) {
      setError("Failed to create comment. Please try again.");
      console.error("Error creating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment({ commentId });
      if (response.statusCode === 200) {
        await fetchComments();
        setOpenMenuId(null); // Add this line to close menu after deletion
      } else {
        setError(response.message || "Failed to delete comment");
      }
    } catch (error) {
      setError("Failed to delete comment. Please try again.");
      console.error("Error deleting comment:", error);
    }
  };

  const renderComments = (comments, parentId = null, level = 0) => {
    return comments
      .filter(
        (comment) =>
          (comment.parentCommentId?.toString() || null) ===
          (parentId?.toString() || null)
      )
      .map((comment) => {
        const childComments = comments.filter(
          (c) => c.parentCommentId?.toString() === comment._id.toString()
        );
        const isExpanded = expandedComments.includes(comment._id);
        const currentVote = userVoteDirection.get(comment._id);
        const votes = commentVotes[comment._id] || {
          upvotes: 0,
          downvotes: 0,
          total: 0,
        };

        return (
          <div
            key={comment._id}
            className={`ml-${level * 4} mt-2 border-l-2 border-[#2d3646] pl-4`}
          >
            <div className="flex items-start gap-2 group">
              {/* Voting column */}
              <div className="flex flex-col items-center w-10 pt-1">
                <button
                  onClick={() => handleVote(comment._id, "up")}
                  className={`p-1 hover:text-green-400 rounded ${
                    currentVote === "up"
                      ? "text-green-400"
                      : "text-gray-500"
                  }`}
                >
                  <ArrowBigUp size={20} />
                </button>
                <span className="text-sm font-medium text-gray-300">
                  {votes.total}
                </span>
                <button
                  onClick={() => handleVote(comment._id, "down")}
                  className={`p-1 hover:text-red-400 rounded ${
                    currentVote === "down"
                      ? "text-red-400"
                      : "text-gray-500"
                  }`}
                >
                  <ArrowBigDown size={20} />
                </button>
              </div>

              {/* Comment content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="font-medium text-green-400">
                    {comment.userId?.fullName || "user"}
                  </span>
                  {comment.userId?.isExpert && (
                    <span className="px-1.5 py-0.5 bg-teal-500/20 text-teal-400 text-xs rounded-full">
                      Expert
                    </span>
                  )}
                  <span className="text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-gray-100 text-sm mb-2">{comment.content}</p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setReplyTo(comment._id)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <Reply size={14} />
                    <span>Reply</span>
                  </button>
                  
                  {/* {userInfo?.user?._id === comment.author?._id && (
                <div className="relative comment-menu" ref={menuRef}>
                  <button
                    ref={buttonRef}
                    onClick={() =>
                      setOpenMenuId((prev) =>
                        prev === comment._id ? null : comment._id
                      )
                    }
                    className="p-1 hover:text-green-400 rounded-full transition-colors text-gray-400"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === comment._id && (
                    <div className="absolute right-0 bg-[#1e2632] border border-[#2d3646] rounded-xl shadow-xl p-2 z-10">
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-[#222a37] w-full text-red-400 rounded-lg"
                      >
                        <Trash size={14} />
                        <span>Delete</span>
                      </button>
                        </div>
                      )}
                    </div>
                  )} */}
                </div>

                {childComments.length > 0 && (
                  <button
                    onClick={() => toggleCommentExpansion(comment._id)}
                    className="flex items-center gap-1 text-xs text-green-400 mt-2 hover:text-teal-300"
                  >
                    <ChevronRight
                      className={`transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                      size={16}
                    />
                    {isExpanded
                      ? "Collapse"
                      : `${childComments.length} ${
                          childComments.length === 1 ? "reply" : "replies"
                        }`}
                  </button>
                )}
              </div>
            </div>

            {/* Child comments */}
            {isExpanded && (
              <div className="ml-8 border-l-2 border-[#2d3748]">
                {renderComments(comments, comment._id, level + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <section className="mt-8 max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">
        {comments.length} Community Insights
      </h2>

      {userInfo && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex flex-col gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                replyTo
                  ? "Write your reply..."
                  : "What are your thoughts?"
              }
              className="w-full p-3 bg-[#1a202c] border border-[#2d3748] rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-100 placeholder-gray-500 text-sm resize-y min-h-[100px]"
            />
            <div className="flex justify-between items-center">
              {replyTo && (
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-sm text-gray-400 hover:text-green-400"
                >
                  Cancel reply
                </button>
              )}
              <button
                type="submit"
                className="ml-auto px-4 py-2 bg-green-500 hover:bg-green-400 rounded-lg text-gray-900 font-medium text-sm transition-colors"
              >
                Comment
              </button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <ChevronDown className="animate-spin text-green-400" />
        </div>
      ) : error ? (
        <div className="text-red-400 p-4 bg-[#1a202c] rounded-lg text-sm">
          {error}
        </div>
      ) : comments?.length > 0 ? (
        <div className="bg-[#1a202c] rounded-lg p-4">
          {renderComments(comments)}
        </div>
      ) : (
        <div className="text-gray-400 p-6 bg-[#1a202c] rounded-lg text-center text-sm">
          Be the first to share your insight
        </div>
      )}
    </section>
  );
};
