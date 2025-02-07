import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCommentsByPostId, createComment, deleteComment } from '../../Backend/config';
import { MessageSquare, Reply, Trash, AlertCircle, Loader2 } from 'lucide-react';

export const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  const userInfo = useSelector((state) => state.auth.userData?.data);

  const fetchComments = async () => {
    try {
      const response = await getCommentsByPostId({ postId });
      if (response.statusCode === 200) {
        setComments(response.data);
      } else {
        setError(response.message || 'Failed to fetch comments');
      }
    } catch (error) {
      setError('Failed to fetch comments. Please try again later.');
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const response = await createComment({
        content: newComment,
        postId,
        parentCommentId: replyTo,
      });

      if (response.statusCode === 201) {
        setNewComment('');
        setReplyTo(null);
        fetchComments();
      } else {
        setError(response.message || 'Failed to create comment');
      }
    } catch (error) {
      setError('Failed to create comment. Please try again.');
      console.error('Error creating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment({ commentId });
      if (response.statusCode === 200) {
        fetchComments();
      } else {
        setError(response.message || 'Failed to delete comment');
      }
    } catch (error) {
      setError('Failed to delete comment. Please try again.');
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderComments = (comments, parentId = null, level = 0) => {
    return comments
      .filter((comment) => comment.parentCommentId === parentId)
      .map((comment) => (
        <div
          key={comment._id}
          className={`mb-4 ${level > 0 ? 'ml-6 sm:ml-12' : ''} relative`}
        >
          {level > 0 && (
            <div className="absolute left-0 top-8 bottom-8 w-0.5 bg-[#2d3339]/50 -ml-4" />
          )}

          <div className="group relative bg-[#232830] rounded-xl p-4 sm:p-6 border-2 border-[#2d3339] hover:border-[#3a4046] transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#2d3339] flex items-center justify-center">
                  <span className="font-medium text-[#2ecc71]">
                    {comment.userId.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1">
                  <h4 className="text-sm font-semibold text-gray-200">
                    {comment.userId.fullName || `User ${comment.userId}`}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {comment.content}
                </p>

                <div className="mt-3 flex items-center gap-4">
                  <button
                    onClick={() => setReplyTo(comment._id)}
                    className="text-xs font-medium text-[#2ecc71] hover:text-[#27ae60] flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[#2d3339] transition-all"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                  {userInfo?._id === comment.userId._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-xs font-medium text-red-400 hover:text-red-300 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[#2d3339] transition-all"
                    >
                      <Trash className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {replyTo === comment._id && (
              <form 
                onSubmit={handleSubmitComment}
                className="mt-4 pl-14 relative before:absolute before:left-10 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#2d3339]/50"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#2d3339] flex items-center justify-center">
                      <span className="text-sm font-medium text-[#2ecc71]">
                        {userInfo?.fullName?.charAt(0) || 'Y'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full text-sm rounded-lg border-2 border-[#2d3339] bg-[#1a1f24] text-gray-200 focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/30 p-3 resize-none"
                      placeholder="Write your reply..."
                      rows={2}
                      required
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        className="text-sm bg-gradient-to-r from-[#2ecc71] to-[#27ae60] text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        Post Reply
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyTo(null)}
                        className="text-sm text-gray-400 hover:text-gray-300 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {renderComments(comments, comment._id, level + 1)}
        </div>
      ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#2ecc71]" />
        <span className="ml-3 text-gray-400">Loading insights...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/30 border border-red-700/50 text-red-200 rounded-xl flex items-center gap-2">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!replyTo && (
        <div className="bg-[#232830] rounded-xl p-4 sm:p-6 border-2 border-[#2d3339]">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#2d3339] flex items-center justify-center">
                <span className="font-medium text-[#2ecc71]">
                  {userInfo?.fullName?.charAt(0) || 'Y'}
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmitComment} className="flex-1 space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full text-sm rounded-lg border-2 border-[#2d3339] bg-[#1a1f24] text-gray-200 focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/30 p-3 resize-none"
                placeholder="Share your financial analysis..."
                rows={3}
                required
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#2ecc71] to-[#27ae60] text-white px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Post Insight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {comments.length > 0 ? (
          renderComments(comments)
        ) : (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto text-[#2d3339] mb-3" />
            <p>No insights yet. Start the financial discussion!</p>
          </div>
        )}
      </div>
    </div>
  );
};
