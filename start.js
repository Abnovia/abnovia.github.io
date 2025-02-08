require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// MongoDB connection event handlers
mongoose.connection
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  })
  .on('disconnected', () => {
    console.log('Mongoose connection disconnected');
  });

// Load models
require('./models/Registration');

// Start Express app
const app = require('./app');
const port = process.env.PORT || 7000;

const server = app.listen(port, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
