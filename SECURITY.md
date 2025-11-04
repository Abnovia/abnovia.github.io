# Security Setup Guide

This guide explains how to set up secure authentication for your blog application.

## ⚠️ Important Security Changes

**The hardcoded credentials have been removed!** The application now uses:
- **JWT (JSON Web Tokens)** for authentication
- **Bcrypt password hashing** for secure password storage
- **Environment variables** for credentials (never stored in code)

---

## Setup Instructions

### 1. Generate a Secure Password Hash

Run the password generator script:

```bash
node scripts/generate-password.js <your-secure-password>
```

Example:
```bash
node scripts/generate-password.js MySecureP@ssw0rd123
```

This will output:
```
=================================
Password Hash Generated
=================================

Add this to your .env file:

ADMIN_PASSWORD_HASH="$2a$10$..."

=================================
```

Copy the generated hash to your `.env` file.

### 2. Generate a JWT Secret

Generate a strong random JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

This will output a long random string like:
```
a1b2c3d4e5f6...
```

Copy this to your `.env` file as `JWT_SECRET`.

### 3. Configure Environment Variables

Update your `.env` file with all required variables:

```env
# MongoDB Connection
DATABASE=mongodb://localhost:27017/blog

# Server Configuration
PORT=7000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<paste-hash-from-step-1>

# JWT Secret
JWT_SECRET=<paste-secret-from-step-2>
```

---

## Production Deployment

### Railway or Render

When deploying to Railway or Render, add these environment variables in the dashboard:

1. **ADMIN_USERNAME** - Your chosen admin username
2. **ADMIN_PASSWORD_HASH** - The bcrypt hash from step 1
3. **JWT_SECRET** - The random secret from step 2
4. **DATABASE** - Your MongoDB connection string
5. **NODE_ENV** - Set to `production`
6. **PORT** - Will be auto-set by the platform

### Generating Password Hash for Production

If you don't have Node.js locally, you can use an online bcrypt generator:
- https://bcrypt-generator.com/
- Use **10 rounds** (default)
- Copy the hash to your environment variables

⚠️ **Never commit your actual password or hash to Git!**

---

## How Authentication Works

### 1. Login Flow

1. User enters username and password
2. Frontend sends POST request to `/auth/login`
3. Backend verifies credentials against environment variables
4. Backend returns a JWT token (valid for 7 days)
5. Frontend stores token in localStorage
6. Token is sent with all authenticated requests

### 2. Protected Routes

The following endpoints require authentication:
- `PUT /post/:id` - Update a blog post
- `DELETE /post/:id` - Delete a blog post

These endpoints expect an `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### 3. Token Expiration

- Tokens expire after **7 days**
- Users must log in again after expiration
- Expired tokens are automatically cleared from localStorage

---

## Security Best Practices

### ✅ DO

- Use a strong, unique password (12+ characters, mixed case, numbers, symbols)
- Use a random JWT secret (at least 64 characters)
- Change default credentials immediately
- Use different credentials for development and production
- Keep your `.env` file out of version control (already in `.gitignore`)
- Regenerate JWT secret if you suspect it's been compromised

### ❌ DON'T

- Don't use simple passwords like "password123"
- Don't share your JWT secret publicly
- Don't commit `.env` files to Git
- Don't reuse passwords from other services
- Don't share your admin credentials

---

## Changing Your Password

If you need to change your admin password:

1. Generate a new password hash:
   ```bash
   node scripts/generate-password.js YourNewPassword
   ```

2. Update `ADMIN_PASSWORD_HASH` in your `.env` file (local) or deployment platform (production)

3. Restart the server

4. Log in with the new password

---

## Troubleshooting

### "Invalid credentials" error

- Check that `ADMIN_USERNAME` matches what you're entering
- Verify the password hash was generated correctly
- Make sure environment variables are loaded (restart server)

### "Server configuration error"

- Ensure all required environment variables are set:
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD_HASH`
  - `JWT_SECRET`

### "Token expired" error

- Your JWT token has expired (7 days)
- Log out and log in again

### Can't log in after deployment

- Verify environment variables are set in your deployment platform
- Check deployment logs for errors
- Ensure `NODE_ENV=production` is set

---

## Advanced: Rotating JWT Secrets

If you need to invalidate all existing tokens:

1. Generate a new JWT secret
2. Update `JWT_SECRET` in your environment
3. Restart the server
4. All users will need to log in again

---

## Questions?

If you encounter issues:
1. Check the server logs for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Test with a fresh browser session (clear localStorage)

---

**Remember: Security is important! Never expose your credentials or JWT secret.**
