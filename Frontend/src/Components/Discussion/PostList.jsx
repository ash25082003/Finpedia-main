import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAllPosts, 
  togglePostVote, 
  getVotedPosts, 
  getPostVoteCount, 
  getCommentsByPostId 
} from "../../Backend/config";
import { MessageCircle, Calendar, User, ArrowUp, AlertCircle, Loader2, Search } from 'lucide-react';
import DOMPurify from 'dompurify';

export const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [votedPosts, setVotedPosts] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async (pageNum, search = '') => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      setError('');

      const [postsResponse, votedResponse] = await Promise.all([
        getAllPosts({ 
          page: pageNum, 
          limit: 10, 
          ...(search && { search }) 
        }),
        getVotedPosts(),
      ]);

      if (postsResponse.statusCode === 200) {
        const newPosts = postsResponse.data;
        const hasMorePosts = newPosts.length === 10;
        
        const enrichedPosts = await Promise.all(
          newPosts.map(async post => ({
            ...post,
            voteCount: (await getPostVoteCount(post._id)).data.count,
            commentCount: (await getCommentsByPostId({ postId: post._id })).data
          }))
        );

        setVotedPosts(new Set(votedResponse?.data?.map(p => p._id)) || null);
        setPosts(prev => search || pageNum === 1 ? enrichedPosts : [...prev, ...enrichedPosts]);
        setHasMore(hasMorePosts);
      }
    } catch (error) {
      setError('Failed to fetch posts. Please try again later.');
      console.error('Error fetching posts:', error);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching]);

  // Infinite scroll handler
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetching && !searchQuery) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    const trigger = document.querySelector('#scroll-trigger');
    if (trigger) observer.observe(trigger);

    return () => observer.disconnect();
  }, [hasMore, isFetching, searchQuery]);

  // Search debounce effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      fetchPosts(1, searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Initial load and page changes
  useEffect(() => {
    if (!searchQuery) fetchPosts(page);
  }, [page]);

  const handleVote = async (postId) => {
    try {
      const originalPosts = [...posts];
      const postIndex = posts.findIndex(p => p._id === postId);
      const wasVoted = votedPosts?.has(postId) || false;

      // Optimistic update
      setPosts(prev => prev.map(post => 
        post._id === postId ? { 
          ...post, 
          voteCount: wasVoted ? post.voteCount - 1 : post.voteCount + 1 
        } : post
      ));
      
      setVotedPosts(prev => {
        const newSet = new Set(prev);
        wasVoted ? newSet.delete(postId) : newSet.add(postId);
        return newSet;
      });

      // API call
      const response = await togglePostVote(postId);
      if (!response.success) {
        setPosts(originalPosts);
        setVotedPosts(prev => new Set(prev));
      }
    } catch (error) {
      console.error('Voting failed:', error);
    }
  };

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
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f24] to-[#15191e] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2ecc71] to-[#27ae60] bg-clip-text text-transparent mb-8 text-center">
          Financial Discussions
        </h1>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts by title, content, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1f24] border-2 border-[#2d3339] rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#2ecc71] transition-colors"
          />
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

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
                      <span>{post.userId?.fullName || "Anonymous"}</span>
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

                  <div className="absolute bottom-2 left-2 flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleVote(post._id);
                      }}
                      className={`p-1.5 rounded-full hover:bg-[#2d3339] transition-colors ${
                        votedPosts.has(post._id) ? 'text-[#2ecc71]' : 'text-gray-400'
                      }`}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-medium text-gray-300">
                      {post.voteCount}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 flex items-center gap-2 text-gray-400 text-xs">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentCount?.length || 0}</span>
                  </div>
                </div>
              </Link>
            );
          })}

          <div id="scroll-trigger" className="h-4" />
          
          {isFetching && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#2ecc71]" />
            </div>
          )}

          {!hasMore && !searchQuery && (
            <div className="text-center py-8 text-gray-400">
              You've reached the end of discussions
            </div>
          )}

          {posts.length === 0 && !isFetching && (
            <div className="text-center py-8 text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[#2ecc71]" />
              <p className="text-lg">
                {searchQuery ? 
                  "No posts found matching your search criteria" : 
                  "No discussions available yet"
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-6 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg font-medium transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
