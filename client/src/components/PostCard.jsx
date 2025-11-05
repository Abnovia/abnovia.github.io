import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post, onEdit, onDelete, showActions }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0].replace(/-/g, '/');
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/posts/${post._id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        {post.title}
      </h3>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>By {post.author} • </span>
        <span>{formatDate(post.date)}</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {post.content}
      </p>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {showActions && (
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => onEdit(post)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(post._id)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
};

export default PostCard;
