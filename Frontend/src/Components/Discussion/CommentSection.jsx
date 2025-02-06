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

  // Fetch user info from Redux
  const userInfo = useSelector((state) => state.auth.userData?.data);

  const fetchComments = async () => {
    try {
      const response = await getCommentsByPostId({ postId });
      if (response.statusCode === 200) {
        console.log(response)
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
        fetchComments(); // Refresh comments after deletion
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
      month: 'long',
      day: 'numeric',
    });
  };

  const renderComments = (comments, parentId = null, level = 0) => {
    return comments
      .filter((comment) => comment.parentCommentId === parentId)
      .map((comment) => (
        <div
          key={comment._id}
          style={{ marginLeft: `${level * 20}px` }} // Dynamic left margin for nested replies
          className="mb-4"
        >
          <div className="bg-gray-50 rounded-lg p-4 border-l-2 border-indigo-200">
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              <MessageSquare className="w-4 h-4" />
              <span>{comment.userId.fullName || `User ${comment.userId}`}</span>
              <span>•</span>
              <span>{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-gray-700 mb-2">{comment.content}</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setReplyTo(comment._id)}
                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
              {userInfo?._id === comment.userId._id && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          {replyTo === comment._id && (
            <form onSubmit={handleSubmitComment} className="mt-2 space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                placeholder="Write your reply..."
                rows={2}
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Post Reply
              </button>
            </form>
          )}

          {/* Render replies recursively */}
          {renderComments(comments, comment._id, level + 1)}
        </div>
      ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        {!replyTo && (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              placeholder="Write your comment..."
              rows={3}
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Post Comment
            </button>
          </form>
        )}
      </div>

      <div className="space-y-4">{renderComments(comments)}</div>
    </div>
  );
};
