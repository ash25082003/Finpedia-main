import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPostById,
  getCommentsByPostId,
  getPostVoteCount,
  getVotedPosts,
  togglePostVote,
} from "../Backend/config";
import {
  MessageCircle,
  Calendar,
  User,
  ChevronLeft,
  Clock,
  ArrowBigUp,
  ArrowBigDown,
  Edit,
  Plus
} from "lucide-react";
import { CommentSection } from "../Components/Discussion/CommentSection";
import DOMPurify from "dompurify";
import apiService from "../Backend/userauth";

export const SinglePostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postLoading, setPostLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [voteCount, setVoteCount] = useState(0);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById({ id: postId });
        if (response.statusCode === 200) {
          setPost(response.data);
        } else {
          setError(response.message || "Post not found");
        }
      } catch (error) {
        setError("Failed to fetch post");
      } finally {
        setPostLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const userresp = await apiService.getCurrentUser();
        setUser(userresp.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await getCommentsByPostId({ postId });
        if (response.statusCode === 200) {
          setComments(response.data);
        } else {
          setError(response.message || "Comments not found");
        }
      } catch (error) {
        setError("Failed to fetch comments");
      } finally {
        setCommentsLoading(false);
      }
    };

    // Current fetchVoteData
    const fetchVoteData = async () => {
      try {
        const voteCountRes = await getPostVoteCount(postId);
        if (voteCountRes.statusCode === 200) {
          setVoteCount(voteCountRes.data.total); // Assuming new structure { up: X, down: Y, total: Z }
        }
        if (user) {
          const votedPostsRes = await getVotedPosts();
          if (votedPostsRes.statusCode === 200) {
            const currentVote = votedPostsRes.data.find(
              (p) => p.post === postId
            )?.voteType;
            setUserVote(currentVote || null);
          }
        }
      } catch (error) {
        console.error("Error fetching vote data:", error);
      }
    };

    const initializeData = async () => {
      await fetchPost();
      await fetchUser();
      await fetchComments();
      if (postId) await fetchVoteData();
    };

    initializeData();
  }, [postId, user]);

  const handleVote = async (direction) => {
    if (!user) return;

    const previousVote = userVote;
    const previousCount = voteCount;

    // Optimistic update
    let newCount = voteCount;
    if (previousVote === direction) {
      // Undo vote
      newCount = direction === "up" ? voteCount - 1 : voteCount + 1;
      setUserVote(null);
    } else {
      // Change vote
      const voteValue = direction === "up" ? 1 : -1;
      newCount = previousVote
        ? voteCount + voteValue * 2 // Swapping vote direction
        : voteCount + voteValue; // New vote
      setUserVote(direction);
    }
    setVoteCount(newCount);

    try {
      await togglePostVote(postId, direction);
    } catch (error) {
      // Rollback on error
      setVoteCount(previousCount);
      setUserVote(previousVote);
      console.error("Voting failed:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const readingTime = (html) => {
    const text = new DOMParser().parseFromString(html, "text/html").body
      .textContent;
    const words = text.trim().split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
  };

  if (postLoading || commentsLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1f24] flex items-center justify-center">
        <div className="max-w-2xl p-8 bg-[#232830] rounded-xl shadow-lg text-center border border-[#2d3339]">
          <div className="text-red-400 mb-4">{error}</div>
          <Link
            to="/discussion"
            className="text-[#2ecc71] hover:text-[#27ae60] flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to discussions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Navigation Header - Stack Overflow style */}
    <div className="mb-6 flex items-center justify-between border-b border-[#2d3339] pb-4">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-gray-300 hover:text-emerald-400 text-sm font-medium flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Discussions
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-7 w-7 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
          <User className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="text-gray-300 text-sm">
          {post?.userId?.username || "Anonymous"}
        </span>
      </div>
    </div>

    {/* Main Content Area */}
    <article className="bg-[#161b22] rounded-lg border border-[#2d3339]">
      <div className="p-6">
        {/* Post Header - SO Style */}
        <div className="flex items-start gap-4 mb-6">
          {/* Voting Section - Vertical Stack Overflow Layout */}
          <div className="flex flex-col items-center gap-2 mr-4">
            <button
              onClick={() => handleVote("up")}
              className={`p-2 rounded hover:bg-emerald-500/10 ${
                userVote === "up" ? "text-emerald-400" : "text-gray-400"
              }`}
            >
              <ArrowBigUp size={20} />
            </button>
            <span className="text-gray-100 font-medium text-lg">{voteCount}</span>
            <button
              onClick={() => handleVote("down")}
              className={`p-2 rounded hover:bg-red-500/10 ${
                userVote === "down" ? "text-red-400" : "text-gray-400"
              }`}
            >
              <ArrowBigDown size={20} />
            </button>
          </div>

          <div className="flex-1">
            {/* Question Header */}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-gray-100">
                  {post?.title || "Title"}
                </h1>
                {user?._id === post?.userId._id && (
                  <Link
                    to={`/edit/${post?._id}`}
                    className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <time className="font-medium">
                  {new Date(post?.createdAt).toLocaleDateString()}
                </time>
                <span>by</span>
                <span className="text-emerald-400">
                  {post?.userId?.username || "Anonymous"}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-8 text-gray-300 leading-relaxed">
              <div
                className="prose prose-invert max-w-none
                          prose-p:my-3 prose-li:my-2
                          prose-code:bg-[#0d1117] prose-code:px-2 prose-code:py-1 prose-code:rounded
                          prose-pre:bg-[#0d1117] prose-pre:p-4 prose-pre:rounded-lg"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />
            </div>
          </div>
        </div>

        {/* Comments Section - SO Style */}
        <div className="ml-12 border-t border-[#2d3339] pt-6">
          <h3 className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            {comments?.length || 0} {comments?.length === 1 ? "Answer" : "Answers"}
          </h3>
          <CommentSection postId={post._id} />
        </div>
      </div>
    </article>

    {/* Action Button - SO Floating Style */}
    <div className="fixed bottom-6 right-6">
      <Link
        to="/discussion"
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-full 
                  shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        New Question
      </Link>
    </div>
  </div>
</div>


  );
};
