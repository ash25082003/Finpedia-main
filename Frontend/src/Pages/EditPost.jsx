import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../Backend/config';
import { MessageSquarePlus, ChevronLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';

// Configure DOMPurify for mentions
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if (node.tagName === 'A' && node.getAttribute('href')?.startsWith('/company/')) {
    node.setAttribute('style', 'color: #3b82f6; text-decoration: none;');
  }
  return node;
});

export const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('active');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [postLoading, setPostLoading] = useState(true);
  const [companies] = useState([
    { id: 1, name: 'TechCorp' },
    { id: 2, name: 'InnovateX' },
    { id: 3, name: 'DigitalWeb' },
    // ... other companies
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById({ id: postId });
        if (response.statusCode === 200) {
          setTitle(response.data.title);
          setContent(response.data.content);
          setStatus(response.data.status);
          setPostLoading(false);
        } else {
          setError(response.message || 'Failed to load post');
          setPostLoading(false);
        }
      } catch (error) {
        setError('Error loading post');
        setPostLoading(false);
        console.error('Fetch post error:', error);
      }
    };
    
    fetchPost();
  }, [postId]);

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

    editor.deleteText(atSymbolIndex, cursorPosition - atSymbolIndex);
    editor.insertText(atSymbolIndex, `@${companyName} `, 'user');
    editor.formatText(
      atSymbolIndex,
      companyName.length + 1,
      {
        link: `/company/${companyId}`,
        color: '#3b82f6'
      }
    );
    setShowMentions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !title.trim()) {
      setError('Title and content cannot be empty');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await updatePost({
        id: postId,
        postData: {
          title: DOMPurify.sanitize(title),
          content: DOMPurify.sanitize(content, {
            ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
            ALLOWED_ATTR: ['href', 'style'],
            FORBID_TAGS: ['script']
          }),
          status: status
        }
      });
      
      if (response.statusCode === 200) {
        navigate(`/discussion/${postId}`);
      } else {
        setError(response.message || 'Failed to update post');
      }
    } catch (error) {
      setError('Failed to update post. Please try again.');
      console.error('Update post error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (postLoading) {
    return <div className="min-h-screen bg-[#1a1f24] flex items-center justify-center text-[#2ecc71]">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1f24] flex items-center justify-center">
        <div className="text-red-400 max-w-2xl p-8 bg-[#232830] rounded-xl text-center">
          <div className="mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="text-[#2ecc71] hover:text-[#27ae60] flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f24] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-[#2ecc71] hover:text-[#27ae60]"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Post</span>
        </button>

        <div className="bg-[#232830] rounded-xl shadow-2xl border border-[#2d3339] p-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquarePlus className="w-8 h-8 text-[#2ecc71]" />
            <h1 className="text-3xl font-bold text-[#2ecc71]">Edit Post</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md border border-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border-[#2d3339] bg-[#1a1f24] text-gray-200 focus:border-[#2ecc71] focus:ring-[#2ecc71] p-3"
                placeholder="Post Title"
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-200 mb-2">
                Post Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-md border-[#2d3339] bg-[#1a1f24] text-gray-200 focus:border-[#2ecc71] focus:ring-[#2ecc71] p-3"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-200">
                  Content
                </label>
                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  className="text-sm px-3 py-1.5 bg-[#1a1f24] hover:bg-[#2d3339] rounded-md text-[#2ecc71] hover:text-[#27ae60] transition-colors border border-[#2d3339]"
                >
                  {isPreview ? 'Edit Content' : 'Preview Content'}
                </button>
              </div>

              {isPreview ? (
                <div 
                  className="prose prose-invert max-w-none p-4 border border-[#2d3339] rounded-md bg-[#1a1f24] min-h-[400px]"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                />
              ) : (
                <div className="relative">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={content}
                    onChange={handleContentChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Write your post content here..."
                    className="bg-[#1a1f24] rounded-md border border-[#2d3339]"
                    style={{ 
                      height: '400px',
                      border: 'none',
                      color: '#fff'
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

            <div className="mt-8">
              <div className="border-t border-[#2d3339] mb-6"></div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-[#2d3339] text-gray-300 rounded-md hover:bg-[#363d45] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-[#2ecc71] text-white rounded-md hover:bg-[#27ae60] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Updating...' : 'Update Post'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
