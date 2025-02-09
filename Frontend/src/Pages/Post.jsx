import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById, getCommentsByPostId, getPostVoteCount, getVotedPosts, togglePostVote } from '../Backend/config';
import { MessageCircle, Calendar, User, ChevronLeft, Clock, ArrowBigUp, Edit } from 'lucide-react';
import { CommentSection } from '../Components/Discussion/CommentSection';
import DOMPurify from 'dompurify';
import apiService from '../Backend/userauth';

export const SinglePostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postLoading, setPostLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

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
      } finally {
        setPostLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const userresp = await apiService.getCurrentUser();
        setUser(userresp.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await getCommentsByPostId({ postId });
        if (response.statusCode === 200) {
          setComments(response.data);
        } else {
          setError(response.message || 'Comments not found');
        }
      } catch (error) {
        setError('Failed to fetch comments');
      } finally {
        setCommentsLoading(false);
      }
    };

    const fetchVoteData = async () => {
      try {
        const voteCountRes = await getPostVoteCount(postId);
        if (voteCountRes.statusCode === 200) {
          setUpvoteCount(voteCountRes.data.count);
        }

        if (user) {
          const votedPostsRes = await getVotedPosts();
          if (votedPostsRes.statusCode === 200) {
            setHasUpvoted(votedPostsRes.data.some(p => p.post === postId));
           
          }
        }
      } catch (error) {
        console.error('Error fetching vote data:', error);
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
  

  const handleUpvote = async () => {
    if (!user) return;

    const previousCount = upvoteCount;
    const previousVoteState = hasUpvoted;

    // Optimistic update
    setUpvoteCount(prev => previousVoteState ? prev - 1 : prev + 1);
    setHasUpvoted(!previousVoteState);

    try {
      await togglePostVote(postId);
    } catch (error) {
      // Rollback on error
      setUpvoteCount(previousCount);
      setHasUpvoted(previousVoteState);
      console.error('Error toggling vote:', error);
    }
  };

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
              <div className="flex justify-between items-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#2ecc71]">
                  {post?.title || "Title"}
                </h1>
                
                {user?._id === post?.userId._id && (
                  <Link
                    to={`/edit/${post?._id}`}
                    className="flex items-center gap-1 bg-[#2ecc71] hover:bg-[#27ae60] text-white text-sm px-3 py-1.5 rounded-md transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 items-center text-sm">
                <button 
                  onClick={handleUpvote}
                  className={`flex items-center gap-2 bg-[#1a1f24] px-3 py-1.5 rounded-full transition-colors 
                    ${user ? 'hover:bg-[#2d3339] cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                    ${hasUpvoted ? 'text-[#2ecc71]' : 'text-gray-200'}`}
                  disabled={!user}
                >
                  <ArrowBigUp className={`w-4 h-4 ${hasUpvoted ? 'fill-[#2ecc71]' : ''}`} />
                  <span className="font-medium">{upvoteCount}</span>
                </button>

                <div className="flex items-center gap-2 bg-[#1a1f24] px-3 py-1.5 rounded-full">
                  <User className="w-4 h-4 text-[#2ecc71]" />
                  <span className="font-medium text-gray-200">{post?.userId.fullName}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-[#1a1f24] px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-200">{formatDate(post?.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2 bg-[#1a1f24] px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-white">{readingTime(post.content)}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div 
                className="prose prose-invert max-w-none text-white 
                          prose-headings:text-white
                          prose-p:text-white 
                          prose-a:text-[#2ecc71] prose-a:no-underline hover:prose-a:text-[#27ae60]
                          prose-blockquote:border-l-4 prose-blockquote:border-[#2ecc71] prose-blockquote:bg-[#1a1f24] prose-blockquote:px-6 prose-blockquote:py-3
                          prose-img:rounded-xl prose-img:shadow-lg
                          prose-ul:text-white prose-li:text-white
                          prose-pre:bg-[#1a1f24] prose-pre:rounded-xl
                          mb-12"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />
            </div>

            <div className="pt-8 border-t border-[#2d3339]">
              <div className="flex items-center gap-3 mb-8">
                <MessageCircle className="w-8 h-8 text-[#2ecc71]" />
                <h3 className="text-2xl font-bold text-gray-100">
                  {comments?.length || 0} {comments?.length === 1 ? 'Comment' : 'Comments'}
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
