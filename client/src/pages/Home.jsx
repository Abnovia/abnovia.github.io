import React from 'react';
import { Link } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { createPost } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  const handleSubmit = async (formData) => {
    if (!isAuthenticated || !token) {
      alert('Please login to create a post');
      return;
    }

    try {
      const response = await createPost(formData, token);
      console.log('Post creation response:', response);
      navigate('/posts');
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
      } else {
        alert(
          error.response?.data?.error ||
            'Failed to create post. Please try again.'
        );
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {isAuthenticated ? (
        <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Create New Blog Post
          </h2>
          <PostForm onSubmit={handleSubmit} />
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Please log in to create a new blog post. Use the Login button in the top right corner.
          </p>
          <Link
            to="/posts"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All Posts
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
