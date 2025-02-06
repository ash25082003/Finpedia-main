import React, { useState, useEffect } from 'react';
import { getAllPosts } from "../../Backend/config"
import { MessageCircle, Calendar, User } from 'lucide-react';
import { CommentSection } from './CommentSection';
export const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPost, setExpandedPost] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await getAllPosts();
      if (response.statusCode === 200) {
        setPosts(response.data);
      } else {
        setError(response.message || 'Failed to fetch posts');
      }
    } catch (error) {
      setError('Failed to fetch posts. Please try again later.');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {posts.map((post) => (
        <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>User {post.userId}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <button
              onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Comments</span>
            </button>
          </div>
          {expandedPost === post._id && (
            <div className="border-t border-gray-200">
              <CommentSection postId={post._id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};