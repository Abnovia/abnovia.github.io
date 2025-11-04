import axios from 'axios';

// Use environment variable or fallback to relative URL for production
const getBaseURL = () => {
  // In production (built app), use relative URLs (same domain)
  if (import.meta.env.PROD) {
    return window.location.origin;
  }
  // In development, use Vite's env variable or default to localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:7000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials in requests
});

// Add response interceptor for better error handling and logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Network Error') {
      console.error('Network Error Details:', {
        message: 'Could not connect to the server',
        baseURL: api.defaults.baseURL,
        withCredentials: api.defaults.withCredentials,
        headers: error.config?.headers,
      });
    } else {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      });
    }
    return Promise.reject(error);
  }
);

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url, {
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials,
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getPosts = () => api.get('/posts');
export const createPost = (post) => api.post('/post', post);
export const updatePost = (id, post, credentials) =>
  api.put(`/post/${id}`, post, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

export const deletePost = (id, credentials) => {
  if (!credentials) {
    return Promise.reject(new Error('No credentials provided'));
  }

  console.log('Making delete request:', {
    id,
    hasCredentials: !!credentials,
    authHeader: `Basic ${credentials}`,
  });

  return api.delete(`/post/${id}`, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });
};

export default api;
