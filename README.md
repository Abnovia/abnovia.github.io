# Abnovia Blog

A modern full-stack blog platform built with React, Express, and MongoDB.

## 🚀 Features

- Create, read, update, and delete blog posts
- Dark mode support
- Responsive design with Tailwind CSS
- Authentication for admin operations
- Tag-based post organization
- Modern React 18 with Vite

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- React Router
- Axios
- Tailwind CSS

**Backend:**
- Express.js
- MongoDB + Mongoose
- Pug templates
- CORS support

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or pnpm

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/abnovia/abnovia.github.io.git
   cd abnovia.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run install-client
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your MongoDB connection string
   ```

4. **Run the development servers**
   ```bash
   # Terminal 1: Backend (port 7000)
   npm run dev

   # Terminal 2: Frontend (port 5173)
   cd client && npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:7000

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Railway or Render.

### Quick Deploy

**Railway:**
```bash
git push origin main
# Then connect your repo on railway.app
```

**Render:**
```bash
git push origin main
# Then create a new Web Service on render.com
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 7000) | No |
| `NODE_ENV` | Environment mode | No |
| `ADMIN_USERNAME` | Admin username | Yes |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of password | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | No |

See [SECURITY.md](./SECURITY.md) for generating secure credentials.

## 🔒 Security

✅ **Secure JWT Authentication Implemented!**

- Passwords stored as bcrypt hashes (never in code)
- JWT tokens for authentication (7-day expiration)
- Environment variables for all credentials
- No hardcoded credentials

**Setup Required:**
1. Generate password hash: `node scripts/generate-password.js <your-password>`
2. Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
3. Add to `.env` file

See [SECURITY.md](./SECURITY.md) for detailed instructions.

## 📖 API Endpoints

- `GET /posts` - Get all blog posts
- `POST /post` - Create a new post
- `PUT /post/:id` - Update a post (requires auth)
- `DELETE /post/:id` - Delete a post (requires auth)
- `GET /about` - About page

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- **Live Demo**: Coming soon
- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: https://github.com/abnovia/abnovia.github.io/issues
