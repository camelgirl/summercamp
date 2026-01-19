# Google OAuth Setup Guide

## Quick Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API** (or **Google Identity Services**)
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for local development)
   - `https://your-site.netlify.app` (for production)
7. Add authorized redirect URIs:
   - `http://localhost:3000` (for local development)
   - `https://your-site.netlify.app` (for production)
8. Copy your **Client ID**


### 2. Set Environment Variable

**For Local Development:**

Create or update `.env` file in the project root:

```bash
VITE_GOOGLE_CLIENT_ID=your_client_id_here-.apps.googleusercontent.com
```

**For Netlify:**

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add:
   - Key: `VITE_GOOGLE_CLIENT_ID`
   - Value: `your_client_id_here.apps.googleusercontent.com`
4. Redeploy your site

### 3. Test

1. Start your development server: `npm run dev`
2. Go to `/login` or `/signup`
3. You should see the "Sign in with Google" button
4. Click it and test the authentication flow

## Features

✅ **Google Sign-In as Default**
- Google sign-in button is prominently displayed
- Email/password is secondary (click "Sign in with Email" to show)

✅ **Automatic User Creation**
- Users are automatically created when signing in with Google
- User data includes: name, email, profile picture

✅ **Session Management**
- User session persists across page refreshes
- Logout properly signs out from Google

## Troubleshooting

### Button doesn't appear
- Check that `VITE_GOOGLE_CLIENT_ID` is set correctly
- Check browser console for errors
- Verify Google Identity Services script is loading

### "Invalid client" error
- Verify your Client ID is correct
- Check that your domain is in authorized JavaScript origins
- Make sure you're using the correct Client ID (not Client Secret)

### Redirect URI mismatch
- Ensure your current URL matches the authorized redirect URIs
- For localhost, use `http://localhost:3000`
- For production, use your full Netlify URL

## Security Notes

- Never commit your Client ID to public repositories
- Use environment variables for all sensitive data
- The Client ID is safe to expose in frontend code (it's public)
- Client Secret should NEVER be in frontend code

## Production Checklist

- [ ] Google OAuth Client ID created
- [ ] Production domain added to authorized origins
- [ ] Environment variable set in Netlify
- [ ] Tested sign-in flow
- [ ] Tested sign-out flow
- [ ] Verified user data is stored correctly
