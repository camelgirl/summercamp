# Netlify Deployment Guide

## Why Netlify Broke After React Conversion

Netlify's free tier doesn't support running Node.js/Express servers. The React app needs to be deployed as a **static site** with **Netlify Functions** for API endpoints.

## ✅ Solution: Static Site + Netlify Functions

I've created the necessary configuration files:

### Files Created:
- `netlify.toml` - Netlify build configuration
- `netlify/functions/camps.js` - API endpoint for camps
- `netlify/functions/school-districts.js` - API endpoint for school districts

## 🚀 Deployment Steps

### Option 1: Deploy via Netlify Dashboard

1. **Go to your Netlify site dashboard**
2. **Site settings** → **Build & deploy**
3. **Update build settings:**
   - **Build command:** `cd client && npm install && npm run build`
   - **Publish directory:** `client/dist`
4. **Deploy site** (or push to trigger auto-deploy)

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd /Users/yinyanhe/Documents/summercamp
netlify deploy --prod
```

### Option 3: Drag & Drop (Quick Test)

1. Build the React app:
   ```bash
   cd client
   npm install
   npm run build
   ```

2. Drag the `client/dist` folder to Netlify Drop: https://app.netlify.com/drop

## 📋 Netlify Build Settings

In your Netlify dashboard, set:

- **Base directory:** (leave empty or set to root)
- **Build command:** `cd client && npm install && npm run build`
- **Publish directory:** `client/dist`
- **Node version:** 18 (or latest LTS)

## 🔧 Alternative: Simpler Static Deployment

If Netlify Functions don't work, you can make it fully static:

1. Copy JSON files to `client/public/`
2. Update React app to fetch from `/camps-data.json` instead of `/api/camps`
3. Deploy just the `client/dist` folder

Would you like me to create this simpler version?

## 🐛 Troubleshooting

### Build Fails
- Check Node version (should be 18+)
- Ensure all dependencies are in `client/package.json`
- Check build logs in Netlify dashboard

### API Not Working
- Verify Netlify Functions are enabled
- Check function logs in Netlify dashboard
- Ensure JSON files are in the root directory

### Routes Not Working
- The `netlify.toml` has redirects for React Router
- All routes should redirect to `index.html`

## 📝 Quick Fix: Make It Fully Static

If you want the simplest deployment, I can modify the app to:
1. Include JSON files in the build
2. Remove API dependency
3. Fetch data directly from static files

This would work perfectly on Netlify without any serverless functions.
