// SinglePostPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById } from '../Backend/config';
import { MessageCircle, Calendar, User, ChevronLeft, Clock } from 'lucide-react';
import { CommentSection } from '../Components/Discussion/CommentSection';
import DOMPurify from 'dompurify';

export const SinglePostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById({ id: postId });
        if (response.statusCode === 200) {
          setPost(response.data);
        } else {
          setError(response.message || 'Post not found');
        }
      } catch (error) {
        setError('Failed to fetch post');
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const readingTime = (html) => {
    const text = new DOMParser().parseFromString(html, 'text/html').body.textContent;
    const words = text.trim().split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/20 flex items-center justify-center">
        <div className="max-w-2xl p-8 bg-white rounded-xl shadow-lg text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Link 
            to="/discussion" 
            className="text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to discussions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/" 
          className="mb-8 inline-flex items-center gap-2 group text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">All Discussions</span>
        </Link>

        <article className="bg-white rounded-2xl shadow-2xl shadow-indigo-100/50 overflow-hidden">
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                {post.title}
              </h1>
              
              <div className="mt-6 flex flex-wrap gap-4 items-center text-sm">
                <div className="flex items-center gap-2 bg-indigo-50/80 px-3 py-1.5 rounded-full">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-indigo-700">User {post.userId}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">{formatDate(post.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">{readingTime(post.content)}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 to-transparent pointer-events-none" />
              <div 
                className="prose prose-lg max-w-none 
                          prose-headings:font-semibold prose-headings:text-gray-900
                          prose-p:text-gray-700 prose-a:text-indigo-600 prose-a:font-medium hover:prose-a:text-indigo-700
                          prose-blockquote:border-l-4 prose-blockquote:border-indigo-200 prose-blockquote:bg-indigo-50/50 prose-blockquote:px-6 prose-blockquote:py-3
                          prose-img:rounded-xl prose-img:shadow-lg
                          prose-ul:list-disc prose-ul:pl-6 prose-ul:text-gray-700
                          prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:p-6
                          mb-12 relative"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />
            </div>

            <div className="pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <MessageCircle className="w-8 h-8 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {post.comments?.length || 0} {post.comments?.length === 1 ? 'Comment' : 'Comments'}
                </h3>
              </div>
              
              <CommentSection postId={post._id} />
            </div>
          </div>
        </article>

        <div className="fixed bottom-8 right-8">
          <Link 
            to="/discussion" 
            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow 
                      border border-gray-100 hover:border-gray-200 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
            <span className="sr-only">Back to discussions</span>
          </Link>
        </div>
      </div>
    </div>
  );
};