# Quick Credential Setup Guide

## ⚡ Quick Start (2 minutes)

Follow these steps to set up your admin credentials:

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Generate Your Password Hash

Choose a strong password and run:

```bash
node scripts/generate-password.js YourStrongPassword123!
```

You'll see output like:
```
=================================
Password Hash Generated
=================================

Add this to your .env file:

ADMIN_PASSWORD_HASH="$2a$10$ABC123..."

=================================
```

### Step 3: Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the long random string that's printed.

### Step 4: Update .env File

Open the `.env` file and update these lines:

```env
# Change 'admin' to your preferred username
ADMIN_USERNAME=admin

# Paste the hash from Step 2
ADMIN_PASSWORD_HASH=$2a$10$ABC123...

# Paste the secret from Step 3
JWT_SECRET=abc123def456...
```

### Step 5: Start the Server

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd client && npm run dev
```

### Step 6: Test Login

1. Open http://localhost:5173 in your browser
2. Look for the login form in the header
3. Enter your username and password
4. You should see "Logged in" message

---

## For Production Deployment

When deploying to Railway or Render:

1. Add these environment variables in the platform dashboard:
   - `ADMIN_USERNAME` - Your username
   - `ADMIN_PASSWORD_HASH` - The hash from Step 2
   - `JWT_SECRET` - The secret from Step 3
   - `DATABASE` - Your MongoDB connection string
   - `NODE_ENV` - Set to `production`

2. See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions

---

## Default Development Credentials

The `.env` file includes development credentials:
- **Username**: `admin`
- **Password**: `changeme`

⚠️ **These are ONLY for local development. Change them before deploying!**

---

## Need Help?

- **Full Security Guide**: See [SECURITY.md](./SECURITY.md)
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **General Info**: See [README.md](./README.md)

---

## Troubleshooting

**Can't login?**
- Check that the server is running (Terminal 1)
- Check that the frontend is running (Terminal 2)
- Verify your `.env` file has all three variables set
- Try restarting the server after changing `.env`

**"Server configuration error"?**
- Make sure you ran `npm install` first
- Check that `.env` file exists and has all variables
- Restart the server

**Password hash looks wrong?**
- It should start with `$2a$10$` or `$2b$10$`
- It should be about 60 characters long
- Don't include quotes when pasting into `.env`
