# Deployment Guide

This guide explains how to deploy the full-stack blog application to Railway or Render.

## Prerequisites

Before deploying, you need:

1. **MongoDB Atlas Account** (free tier available)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a cluster
   - Get your connection string

2. **Railway or Render Account**
   - Railway: https://railway.app (recommended for beginners)
   - Render: https://render.com

3. **Admin Credentials Setup** (REQUIRED)
   - Generate a password hash: `node scripts/generate-password.js <your-password>`
   - Generate a JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - See [SECURITY.md](./SECURITY.md) for detailed instructions

---

## Step 1: Set Up MongoDB Atlas

1. Go to https://cloud.mongodb.com and sign in/sign up
2. Create a new cluster (choose the free M0 tier)
3. Wait for the cluster to be created (2-3 minutes)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
7. Replace `<password>` with your actual database password
8. Add `/blog` before the `?` to specify the database name

Example connection string:
```
mongodb+srv://myuser:mypassword@cluster0.mongodb.net/blog?retryWrites=true&w=majority
```

---

## Option A: Deploy to Railway (Recommended)

### Why Railway?
- Easiest deployment process
- Free $5 monthly credit (enough for small apps)
- Automatic HTTPS
- Simple environment variable management

### Deployment Steps:

1. **Push Your Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Railway Project**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub
   - Select the `abnovia.github.io` repository

3. **Add MongoDB Database** (if not using Atlas)
   - Click "New" → "Database" → "Add MongoDB"
   - Railway will automatically provision a MongoDB instance
   - Copy the connection string from the MongoDB service variables

4. **Configure Environment Variables**
   - Click on your web service
   - Go to "Variables" tab
   - Add the following variables (see SECURITY.md for generating credentials):
     ```
     DATABASE=mongodb+srv://your-connection-string
     NODE_ENV=production
     PORT=7000
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD_HASH=<your-bcrypt-hash>
     JWT_SECRET=<your-random-secret>
     ```

5. **Deploy**
   - Railway will automatically detect the `railway.json` config
   - It will build and deploy your app
   - Wait 3-5 minutes for the first deployment
   - Click on "Settings" → "Generate Domain" to get your public URL

6. **Update CORS Settings** (if needed)
   - Once deployed, add the Railway domain to environment variables:
     ```
     FRONTEND_URL=https://your-app-name.up.railway.app
     ```

### Railway Configuration Files

The project includes `railway.json` for automatic configuration:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run install-client && npm run build"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

---

## Option B: Deploy to Render

### Why Render?
- Free tier for web services (with limitations)
- Automatic SSL certificates
- Good for production apps
- Background workers support

### Deployment Steps:

1. **Push Your Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to https://render.com and sign up
   - Connect your GitHub account

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your `abnovia.github.io` repository
   - Configure the service:
     - **Name**: `abnovia-blog`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run install-client && npm run build`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **Add Environment Variables**
   - Scroll down to "Environment Variables"
   - Click "Add Environment Variable"
   - Add these variables (see SECURITY.md for generating credentials):
     ```
     DATABASE=mongodb+srv://your-connection-string
     NODE_ENV=production
     PORT=10000
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD_HASH=<your-bcrypt-hash>
     JWT_SECRET=<your-random-secret>
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will start building and deploying
   - First deployment takes 5-10 minutes
   - Your app will be available at `https://abnovia-blog.onrender.com`

### Render Configuration File

The project includes `render.yaml` for Blueprint deployment:
```yaml
services:
  - type: web
    name: abnovia-blog
    env: node
    buildCommand: npm install && npm run install-client && npm run build
    startCommand: npm start
```

To use Blueprint:
1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Select your repository
4. Render will automatically detect `render.yaml`

---

## Step 2: Verify Deployment

1. **Check if the app is running**
   - Visit your deployed URL
   - You should see the blog home page

2. **Test the API**
   - Try creating a new blog post
   - Check if posts are being saved to MongoDB

3. **Check Logs** (if something goes wrong)
   - **Railway**: Click on your service → "Logs" tab
   - **Render**: Click on your service → "Logs" section

---

## Common Issues & Troubleshooting

### 1. "Cannot connect to MongoDB"
**Solution**:
- Verify your MongoDB connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas (add `0.0.0.0/0` to allow all IPs)
- Ensure the database password doesn't contain special characters that need URL encoding

### 2. "Build failed" or "npm install errors"
**Solution**:
- Make sure all dependencies are in `package.json`
- Try running locally first: `npm install && npm run build`
- Check build logs for specific error messages

### 3. "502 Bad Gateway" or "Application failed to respond"
**Solution**:
- Verify `PORT` environment variable is set correctly
- Check that `start.js` is using `process.env.PORT`
- Review application logs for startup errors

### 4. "CORS errors" in browser console
**Solution**:
- Add your deployed domain to `FRONTEND_URL` environment variable
- Redeploy after adding the variable

### 5. React app shows 404 errors on refresh
**Solution**:
- This is already handled by the SPA fallback in `app.js`
- Make sure `NODE_ENV=production` is set

---

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/blog` | Yes |
| `NODE_ENV` | Environment mode | `production` | Yes |
| `PORT` | Server port | `7000` (Railway) or `10000` (Render) | No (auto-set) |
| `ADMIN_USERNAME` | Admin username for login | `admin` | Yes |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password | `$2a$10$...` | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | 64+ char random string | Yes |
| `FRONTEND_URL` | Deployed app URL (optional) | `https://your-app.up.railway.app` | No |

**Important:** See [SECURITY.md](./SECURITY.md) for instructions on generating `ADMIN_PASSWORD_HASH` and `JWT_SECRET`.

---

## Post-Deployment Steps

### 1. Update GitHub Pages (Optional)
If you want a landing page on GitHub Pages:
```bash
echo "<meta http-equiv='refresh' content='0; url=https://your-app.up.railway.app'>" > index.html
git add index.html
git commit -m "Add redirect to deployed app"
git push origin main
```

### 2. Set Up Custom Domain (Optional)
- **Railway**: Settings → Networking → Custom Domain
- **Render**: Settings → Custom Domain

### 3. Monitor Your App
- Set up health checks
- Monitor database usage
- Check application logs regularly

---

## Local Development

To run the app locally after deployment setup:

1. **Start MongoDB locally or use MongoDB Atlas**
   ```bash
   # Update .env file with your connection string
   DATABASE=mongodb://localhost:27017/blog
   NODE_ENV=development
   PORT=7000
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run install-client
   ```

3. **Run development servers**
   ```bash
   # Terminal 1: Start backend
   npm run dev

   # Terminal 2: Start frontend
   cd client && npm run dev
   ```

4. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:7000

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] Admin password hash generated (`node scripts/generate-password.js`)
- [ ] JWT secret generated (`node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- [ ] `.env.example` reviewed and actual `.env` created locally with all credentials
- [ ] Code committed and pushed to GitHub
- [ ] Deployment platform account created (Railway or Render)
- [ ] Web service created and connected to GitHub repo
- [ ] Environment variables configured on deployment platform (including auth credentials)
- [ ] First deployment completed successfully
- [ ] Admin login tested with new credentials
- [ ] Deployed app tested (create/read/update/delete posts with authentication)
- [ ] Logs checked for any errors
- [ ] (Optional) Custom domain configured
- [ ] (Optional) GitHub Pages redirects to deployed app

---

## Next Steps

- **Security**: ✅ JWT authentication already implemented! See [SECURITY.md](./SECURITY.md)
- **Features**: Add comments, image uploads, multiple users
- **Monitoring**: Set up error tracking (Sentry, LogRocket)
- **Analytics**: Add Google Analytics or Plausible
- **SEO**: Add meta tags and sitemap
- **Backup**: Set up automated MongoDB backups

---

## Support

If you encounter issues:
1. Check the deployment logs first
2. Verify environment variables are set correctly
3. Test locally to isolate the problem
4. Review MongoDB Atlas network access settings
5. Contact platform support (Railway, Render)

**Happy Deploying! 🚀**
