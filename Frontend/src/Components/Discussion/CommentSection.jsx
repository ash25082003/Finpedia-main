// CommentSection.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCommentsByPostId, createComment, deleteComment } from '../../Backend/config';
import { MessageSquare, Reply, Trash } from 'lucide-react';

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
            <div className="absolute left-0 top-8 bottom-8 w-0.5 bg-gray-200/70 -ml-4" />
          )}

          <div className="group relative bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="font-medium text-indigo-700">
                    {comment.userId.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {comment.userId.fullName || `User ${comment.userId}`}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {comment.content}
                </p>

                <div className="mt-3 flex items-center gap-4">
                  <button
                    onClick={() => setReplyTo(comment._id)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-indigo-50 transition-all"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>

                  {userInfo?._id === comment.userId._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-red-50 transition-all"
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
                className="mt-4 pl-14 relative before:absolute before:left-10 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200/70"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-700">
                        {userInfo?.fullName?.charAt(0) || 'Y'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full text-sm rounded-lg border-gray-200 shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 p-3 resize-none"
                      placeholder="Write your reply..."
                      rows={2}
                      required
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        className="text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        Post Reply
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyTo(null)}
                        className="text-sm text-gray-600 hover:text-gray-700 font-medium"
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
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading comments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!replyTo && (
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="font-medium text-indigo-700">
                  {userInfo?.fullName?.charAt(0) || 'Y'}
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmitComment} className="flex-1 space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full text-sm rounded-lg border-gray-200 shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 p-3 resize-none"
                placeholder="Join the discussion... Share your thoughts and ideas here!"
                rows={3}
                required
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Post Comment
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
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};