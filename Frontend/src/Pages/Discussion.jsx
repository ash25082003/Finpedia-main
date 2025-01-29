import React, { useState } from 'react';
import { CreatePost } from '../Components/Discussion/CreatePost';
import { PostList } from '../Components/Discussion/PostList';
import { MessageSquareText } from 'lucide-react';

function DiscussionPage() {
  const [refreshPosts, setRefreshPosts] = useState(0);

  const handlePostCreated = () => {
    setRefreshPosts(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <MessageSquareText className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Discussion Platform</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <CreatePost onPostCreated={handlePostCreated} />
          <PostList key={refreshPosts} />
        </div>
      </main>
    </div>
  );
}

export default DiscussionPage;