import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from "../../Backend/config";
import { MessageCircle, Calendar, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f24] to-[#15191e] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#2ecc71]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f24] to-[#15191e] flex items-center justify-center">
        <div className="max-w-2xl p-8 bg-[#232830] rounded-xl shadow-2xl border border-[#2d3339] text-center">
          <div className="text-red-300 mb-4 flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
          <button 
            onClick={fetchPosts}
            className="px-6 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f24] to-[#15191e] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2ecc71] to-[#27ae60] bg-clip-text text-transparent mb-8 text-center">
          Financial Discussions
        </h1>
        
        <div className="grid gap-4">
          {posts.map((post) => {
            const contentPreview = truncateContent(post.content, 150);
            
            return (
              <Link 
                key={post._id}
                to={`/discussion/${post._id}`}
                className="block bg-[#1a1f24] rounded-lg border-2 border-[#2d3339] hover:border-[#3a4046] transition-all group hover:shadow-lg"
              >
                <div className="p-5 relative">
                  <h2 className="text-lg font-semibold text-gray-200 mb-2 hover:text-[#2ecc71] transition-colors">
                    {post.title}
                  </h2>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-[#2ecc71]" />
                      <span>User {post.userId}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#2ecc71]" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>

                  <div 
                    className="prose prose-invert max-w-none text-sm text-gray-300 mb-4"
                    dangerouslySetInnerHTML={{ __html: contentPreview }}
                  />

                  <div className="absolute bottom-2 right-2 flex items-center gap-2 text-gray-400 text-xs">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments?.length || 0}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};