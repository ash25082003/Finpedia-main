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
      <div className="min-h-screen bg-[#1a1f24] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2ecc71] border-t-transparent"></div>
      </div>
    );
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
    <div className="min-h-screen bg-[#1a1f24]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/" 
          className="mb-8 inline-flex items-center gap-2 group text-[#2ecc71] hover:text-[#27ae60] transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">All Discussions</span>
        </Link>

        <article className="bg-[#232830] rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-[#2d3339]">
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#2ecc71]">
                {post.title}
              </h1>
              
              <div className="mt-6 flex flex-wrap gap-4 items-center text-sm">
                <div className="flex items-center gap-2 bg-[#1a1f24] px-3 py-1.5 rounded-full">
                  <User className="w-4 h-4 text-[#2ecc71]" />
                  <span className="font-medium text-gray-200">User {post.userId}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-[#1a1f24] px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-200">{formatDate(post.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2 bg-[#1a1f24] px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-200">{readingTime(post.content)}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div 
                className="prose prose-invert max-w-none 
                          prose-headings:text-gray-100
                          prose-p:text-gray-300 
                          prose-a:text-[#2ecc71] prose-a:no-underline hover:prose-a:text-[#27ae60]
                          prose-blockquote:border-l-4 prose-blockquote:border-[#2ecc71] prose-blockquote:bg-[#1a1f24] prose-blockquote:px-6 prose-blockquote:py-3
                          prose-img:rounded-xl prose-img:shadow-lg
                          prose-ul:text-gray-300
                          prose-pre:bg-[#1a1f24] prose-pre:rounded-xl
                          mb-12"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />
            </div>

            <div className="pt-8 border-t border-[#2d3339]">
              <div className="flex items-center gap-3 mb-8">
                <MessageCircle className="w-8 h-8 text-[#2ecc71]" />
                <h3 className="text-2xl font-bold text-gray-100">
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
            className="p-3 bg-[#232830] rounded-full shadow-lg hover:shadow-xl transition-shadow 
                      border border-[#2d3339] hover:border-[#2ecc71] flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5 text-[#2ecc71]" />
            <span className="sr-only">Back to discussions</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
