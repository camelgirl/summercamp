# Fix Google Sign-In Loading Issue

## Problem
Google Sign-In is stuck on "Loading Google Sign In..." and never loads.

## Solution

### Step 1: Check if VITE_GOOGLE_CLIENT_ID is set

The Client ID needs to be in your `.env` file. Vite reads from the `client` directory by default.

**Option A: Add to client/.env (Recommended)**
```bash
# Create or edit client/.env
cd client
echo "VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com" >> .env
```

**Option B: Copy from root .env**
```bash
# If you have it in root .env, copy the VITE_GOOGLE_CLIENT_ID line
grep VITE_GOOGLE_CLIENT_ID .env >> client/.env
```

### Step 2: Verify the Client ID format

Your Client ID should:
- End with `.apps.googleusercontent.com`
- Look like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- NOT be a client secret (which starts with `GOCSPX-`)

### Step 3: Restart the dev server

After adding the Client ID:
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Step 4: Check browser console

Open your browser's developer console (F12) and look for:
- `Google Sign-In: Checking configuration...` - Should show if Client ID is found
- Any error messages about the Google script not loading
- Network errors in the Network tab

### Step 5: Verify Google Script is Loading

Check the Network tab in browser dev tools:
- Look for `https://accounts.google.com/gsi/client`
- It should load successfully (status 200)
- If blocked, check browser extensions or firewall

## Common Issues

### Issue 1: Client ID not found
**Symptom:** Console shows "Client ID not configured"
**Fix:** Make sure `VITE_GOOGLE_CLIENT_ID` is in `client/.env` file

### Issue 2: Google script not loading
**Symptom:** Console shows "Script not loaded" after 10 seconds
**Fix:** 
- Check browser extensions (ad blockers might block it)
- Check network tab for blocked requests
- Try in incognito mode

### Issue 3: Wrong Client ID format
**Symptom:** Google returns authentication errors
**Fix:** Verify the Client ID ends with `.apps.googleusercontent.com`

### Issue 4: Client ID not set in Netlify
**Symptom:** Works locally but not on Netlify
**Fix:** Add `VITE_GOOGLE_CLIENT_ID` to Netlify environment variables

## Debugging

The updated component now logs detailed information to the console:
- Configuration check results
- Script loading status
- Initialization steps
- Any errors

Check your browser console for these logs to diagnose the issue.
