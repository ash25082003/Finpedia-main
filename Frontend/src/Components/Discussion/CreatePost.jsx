import React, { useState } from 'react';
import { createPost } from "../../Backend/config";
import { MessageSquarePlus } from 'lucide-react';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';

export const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  // Simplified editor configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'], // Image option removed
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'blockquote',
    'list', 'bullet',
    'link' // Image format removed
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await createPost({
        title: DOMPurify.sanitize(title),
        content: DOMPurify.sanitize(content),
        industryId: "65f2d6b85d41c0d05fdde5c4",
        status: "active"
      });
      
      if (response.statusCode === 201) {
        setTitle('');
        setContent('');
        onPostCreated();
      } else {
        setError(response.message || 'Failed to create post');
      }
    } catch (error) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#1a1f24] rounded-lg shadow-md border border-[#2d3339]">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquarePlus className="w-6 h-6 text-[#2ecc71]" />
        <h2 className="text-2xl font-bold text-[#2ecc71]">Create a New Post</h2>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md border border-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-200">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-[#2d3339] bg-[#232830] text-gray-200 shadow-sm focus:border-[#2ecc71] focus:ring-[#2ecc71] p-2"
            placeholder="Enter your post title"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-200">
              Content
            </label>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="text-sm px-3 py-1 bg-[#232830] hover:bg-[#2d3339] rounded-md text-[#2ecc71] hover:text-[#27ae60] transition-colors border border-[#2d3339]"
            >
              {isPreview ? 'Switch to Editor' : 'Switch to Preview'}
            </button>
          </div>

          {isPreview ? (
            <div 
              className="preview-content prose prose-invert max-w-none p-3 border border-[#2d3339] rounded-md min-h-[300px] bg-[#232830] text-gray-200"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
          ) : (
            <div className="text-editor-wrapper" style={{ marginTop: 0 }}>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Write your post content here..."
                className="rich-text-editor"
                style={{ 
                  border: 'none',
                  backgroundColor: '#232830',
                  borderRadius: '0.375rem',
                }}
              />
            </div>

          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#2ecc71] text-white py-2 px-4 rounded-md hover:bg-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating Post...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};