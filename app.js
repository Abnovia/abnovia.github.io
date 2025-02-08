const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: 'http://localhost:5173', // Vite's default port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials
    exposedHeaders: ['Authorization'], // Expose Authorization header
  })
);

// MongoDB connection using environment variables
const connectDB = async () => {
  try {
    if (!process.env.DATABASE) {
      throw new Error(
        'MongoDB connection string is not defined in environment variables'
      );
    }

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB connection error:', {
      message: err.message,
      code: err.code,
      name: err.name,
    });
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Initial connection
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error after initial connection:', {
    message: err.message,
    code: err.code,
    name: err.name,
  });
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Add request logging middleware
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Import routes
const indexRouter = require('./routes/index');

// Use routes
app.use('/', indexRouter);

// 404 handler
app.use((req, res, next) => {
  console.log('404 error for path:', req.path);
  const err = new Error(`Page Not Found: ${req.path}`);
  err.status = 404;
  err.userMessage = `The page "${req.path}" you're looking for doesn't exist. Please check the URL and try again.`;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.status || 500;
  const message =
    err.userMessage || 'Something went wrong. Please try again later.';

  res.status(statusCode).json({
    error: message,
    details: app.get('env') === 'development' ? err : undefined,
  });
});

module.exports = app;
