import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { getPosts, updatePost, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleEdit = (post) => {
    if (!isAuthenticated) {
      alert('Please login to edit posts');
      return;
    }
    setEditingPost(post);
  };

  const handleUpdate = async (formData) => {
    if (!isAuthenticated) {
      alert('Please login to update posts');
      return;
    }

    try {
      await updatePost(editingPost._id, formData, token);
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated) {
      alert('Please login to delete posts');
      return;
    }

    if (!token) {
      alert(
        'No authentication token found. Please try logging in again.'
      );
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      console.log('Attempting to delete post:', {
        id,
        hasToken: !!token,
      });

      const response = await deletePost(id, token);
      console.log('Delete response:', response);

      if (response.status === 200) {
        setPosts(posts.filter((post) => post._id !== id));
        alert('Post deleted successfully');
      }
    } catch (error) {
      console.error('Delete error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.config?.headers,
      });

      if (error.message === 'Network Error') {
        alert(
          'Could not connect to the server. Please check your internet connection and try again.'
        );
      } else if (error.response?.status === 401) {
        alert('Authentication failed. Please try logging in again.');
      } else if (error.response?.status === 404) {
        alert('Post not found. It may have been already deleted.');
        // Refresh the posts list
        fetchPosts();
      } else {
        alert(
          error.response?.data?.error ||
            error.response?.data?.details ||
            'Failed to delete post. Please try again.'
        );
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        All Blog Posts
      </h2>

      <div className="space-y-6 mb-24">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id}>
              {editingPost && editingPost._id === post._id ? (
                <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                  <PostForm
                    post={editingPost}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditingPost(null)}
                  />
                </div>
              ) : (
                <PostCard
                  post={post}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  showActions={isAuthenticated}
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700 dark:text-gray-300">
            No blog posts yet.
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Write New Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
