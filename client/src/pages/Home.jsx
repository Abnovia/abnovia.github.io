import React from 'react';
import { Link } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { createPost } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const response = await createPost(formData);
      console.log('Post creation response:', response);
      navigate('/posts');
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        error.response?.data?.error ||
          'Failed to create post. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Create New Blog Post
        </h2>
        <PostForm onSubmit={handleSubmit} />
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-700 dark:text-white mb-4">
          View all blog posts
        </p>
        <Link
          to="/posts"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View All Posts
        </Link>
      </div>
    </div>
  );
};

export default Home;
