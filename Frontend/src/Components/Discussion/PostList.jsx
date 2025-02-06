// PostList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from "../../Backend/config";
import { MessageCircle, Calendar, User, ArrowRight } from 'lucide-react';
import DOMPurify from 'dompurify';

export const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const truncateContent = (html, maxLength = 300) => {
    const cleanHtml = DOMPurify.sanitize(html);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleanHtml;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-2xl p-8 bg-white rounded-xl shadow-lg text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={fetchPosts}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">Discussions</h1>
        <div className="grid gap-8">
          {posts.map((post) => {
            const isContentLong = post.content.length > 500;
            const contentPreview = truncateContent(post.content);
            
            return (
              <div 
                key={post._id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 hover:text-indigo-600 transition-colors">
                    <Link to={`/discussion/${post._id}`}>{post.title}</Link>
                  </h2>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium">User {post.userId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium">{formatDate(post.createdAt)}</span>
                    </div>
                  </div>

                  <div 
                    className="prose max-w-none mb-6 text-gray-600"
                    dangerouslySetInnerHTML={{ __html: contentPreview }}
                  />

                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/discussion/${post._id}`}
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                    >
                      {isContentLong && 'Continue reading'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link 
                      to={`/discussion/${post._id}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments?.length || 0} comments</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};