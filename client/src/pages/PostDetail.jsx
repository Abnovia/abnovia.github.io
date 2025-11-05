import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPosts, updatePost, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await getPosts();
      const foundPost = response.data.posts.find((p) => p._id === id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        alert('Post not found');
        navigate('/posts');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to load post');
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    if (!isAuthenticated) {
      alert('Please login to update posts');
      return;
    }

    try {
      console.log('Updating post with data:', formData);
      const response = await updatePost(post._id, formData, token);
      console.log('Update response:', response);
      setEditing(false);
      await fetchPost();
    } catch (error) {
      console.error('Error updating post:', error);
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
            'Failed to update post. Please try again.'
        );
      }
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      alert('Please login to delete posts');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await deletePost(post._id, token);
      alert('Post deleted successfully');
      navigate('/posts');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-gray-700 dark:text-gray-300">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-gray-700 dark:text-gray-300">Post not found</p>
        <Link
          to="/posts"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          Back to all posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <Link
          to="/posts"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to all posts
        </Link>
      </div>

      {editing ? (
        <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Edit Post
          </h2>
          <PostForm
            post={post}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <article className="bg-white dark:bg-zinc-800 shadow rounded-lg p-8">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">By {post.author}</span>
              <span className="mx-2">•</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </header>

          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {isAuthenticated && (
            <div className="pt-6 border-t border-gray-200 dark:border-zinc-700 flex justify-end space-x-3">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Post
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Post
              </button>
            </div>
          )}
        </article>
      )}
    </div>
  );
};

export default PostDetail;
