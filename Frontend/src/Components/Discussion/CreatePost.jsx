import React, { useState, useRef } from 'react';
import { createPost } from "../../Backend/config";
import { MessageSquarePlus } from 'lucide-react';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';

// Configure DOMPurify to allow required attributes
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if (node.tagName === 'A' && node.getAttribute('href')?.startsWith('/company/')) {
    node.setAttribute('style', 'color: #3b82f6; text-decoration: none;');
  }
  return node;
});

export const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [companies] = useState([
    { id: 1, name: 'TechCorp' },
    { id: 2, name: 'InnovateX' },
    { id: 3, name: 'DigitalWeb' },
    { id: 4, name: 'ByteSolutions' },
    { id: 5, name: 'FutureTech' },
    { id: 6, name: 'CloudNine' },
    { id: 7, name: 'AlphaWorks' },
    { id: 8, name: 'NexGen Systems' }
  ]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
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
    'link', 'color'
  ];

  const handleContentChange = (content, delta, source, editor) => {
    setContent(content);
    
    const cursorPosition = editor.getSelection()?.index;
    if (cursorPosition === undefined) return;

    const textBeforeCursor = editor.getText().slice(0, cursorPosition);
    const atSymbolIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atSymbolIndex !== -1 && !textBeforeCursor.slice(atSymbolIndex+1).includes(' ')) {
      const query = textBeforeCursor.slice(atSymbolIndex + 1);
      setMentionQuery(query);
      
      const bounds = editor.getBounds(cursorPosition);
      setMentionPosition({
        top: bounds.top + bounds.height + 10,
        left: bounds.left
      });
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (companyName, companyId) => {
    const editor = quillRef.current.getEditor();
    const cursorPosition = editor.getSelection()?.index;
    const textBeforeCursor = editor.getText().slice(0, cursorPosition);
    const atSymbolIndex = textBeforeCursor.lastIndexOf('@');

    // Delete the @ symbol and query text
    editor.deleteText(atSymbolIndex, cursorPosition - atSymbolIndex);
    
    // Insert company mention with link and styling
    editor.insertText(atSymbolIndex, `@${companyName} `, 'user');
    editor.formatText(
      atSymbolIndex,
      companyName.length + 1, // +1 for @ symbol
      {
        link: `/company/${companyId}`,
        color: '#3b82f6'
      }
    );
    
    setShowMentions(false);
  };

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
        content: DOMPurify.sanitize(content, {
          ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
          ALLOWED_ATTR: ['href', 'style'],
          FORBID_TAGS: ['script']
        }),
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
    <div className="max-w-2xl mx-auto p-6 bg-[#1a1f24] rounded-lg shadow-md border border-[#2d3339] relative">
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
            <div className="text-editor-wrapper relative" style={{ marginTop: 0 }}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={handleContentChange}
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

              {showMentions && (
                <div 
                  className="absolute z-50 bg-[#232830] border border-[#2d3339] rounded-md shadow-lg p-2 w-48 max-h-48 overflow-y-auto"
                  style={{ 
                    top: mentionPosition.top, 
                    left: mentionPosition.left,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {companies
                    .filter(company => 
                      company.name.toLowerCase().includes(mentionQuery.toLowerCase())
                    )
                    .map(company => (
                      <div
                        key={company.id}
                        onClick={() => insertMention(company.name, company.id)}
                        className="p-2 hover:bg-[#2d3339] rounded-md cursor-pointer text-gray-200 text-sm transition-colors"
                      >
                        {company.name}
                      </div>
                    ))}
                </div>
              )}
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
