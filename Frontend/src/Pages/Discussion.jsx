import React, { useState } from 'react';
import { CreatePost } from '../Components/Discussion/CreatePost';
import { PostList } from '../Components/Discussion/PostList';
import { MessageSquareText, Plus } from 'lucide-react';

function DiscussionPage() {
  const [refreshPosts, setRefreshPosts] = useState(0);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handlePostCreated = () => {
    setCreateModalOpen(false);
    setRefreshPosts(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#1a1f24]">
      <header className="bg-[#1e2329] border-b border-[#2d3339]">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <MessageSquareText className="w-8 h-8 text-[#2ecc71]" />
            <h1 className="text-2xl font-bold text-gray-100">Discussion Platform</h1>
          </div>
        </div>
      </header>

      {/* Floating Create Button */}
      <button
        onClick={() => setCreateModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white p-4 rounded-full shadow-lg transition-all hover:scale-105"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1e2329] rounded-lg p-6 w-full max-w-2xl mx-4 border border-[#2d3339]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-100">Create New Post</h2>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <CreatePost onPostCreated={handlePostCreated} />
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <PostList key={refreshPosts} />
        </div>
      </main>
    </div>
  );
}

export default DiscussionPage;
