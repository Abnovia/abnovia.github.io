import React, { useState, useEffect } from 'react';

const PostForm = ({ post, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    tags: '',
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        author: post.author || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      });
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tags = formData.tags
      ? formData.tags.split(',').map((tag) => tag.trim())
      : [];
    onSubmit({ ...formData, tags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
          Title:
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="block w-full rounded-md bg-gray-50 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
          Content:
        </label>
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          required
          rows="5"
          className="block w-full rounded-md bg-gray-50 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
          Author:
        </label>
        <input
          type="text"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
          className="block w-full rounded-md bg-gray-50 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
          Tags (comma-separated):
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="tech, programming, web"
          className="block w-full rounded-md bg-gray-50 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="submit"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {post ? 'Update' : 'Publish'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PostForm;
