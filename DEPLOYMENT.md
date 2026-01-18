# Deployment Guide - Austin Summer Camps Website

This guide covers the easiest ways to host your summer camp website for free.

## 🚀 Recommended Hosting Options

### Option 1: Netlify (Easiest - Recommended) ⭐

**Why it's great:**
- Free forever
- Drag-and-drop deployment (no Git needed)
- Automatic HTTPS
- Custom domain support
- Fast CDN

**Steps:**
1. Go to [netlify.com](https://www.netlify.com) and sign up (free)
2. Drag and drop your entire `summercamp` folder onto the Netlify dashboard
3. Your site will be live in seconds with a URL like `your-site-name.netlify.app`
4. Done! No configuration needed.

**Or use Netlify Drop:**
- Visit [app.netlify.com/drop](https://app.netlify.com/drop)
- Drag your folder there
- Get instant URL

---

### Option 2: GitHub Pages (Free, Git-based)

**Why it's great:**
- Free forever
- Integrated with GitHub
- Custom domain support
- Reliable hosting

**Steps:**
1. Create a GitHub account at [github.com](https://github.com)
2. Create a new repository (name it `summercamp` or `austin-summer-camps`)
3. Upload your files:
   ```bash
   cd /Users/yinyanhe/Documents/summercamp
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```
4. Go to repository Settings → Pages
5. Select "main" branch and "/ (root)" folder
6. Click Save
7. Your site will be at `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME`

---

### Option 3: Vercel (Great for Performance)

**Why it's great:**
- Free forever
- Very fast
- Easy Git integration
- Automatic HTTPS

**Steps:**
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New Project"
3. Import your GitHub repository (or drag and drop)
4. Deploy! Get URL like `your-project.vercel.app`

---

### Option 4: Surge.sh (Command Line - Super Simple)

**Why it's great:**
- Free
- One command deployment
- Custom domains

**Steps:**
1. Install Surge (requires Node.js):
   ```bash
   npm install -g surge
   ```
2. In your project folder:
   ```bash
   cd /Users/yinyanhe/Documents/summercamp
   surge
   ```
3. Follow prompts (create account if needed)
4. Your site is live!

---

### Option 5: Cloudflare Pages (Fast & Free)

**Why it's great:**
- Free forever
- Very fast CDN
- Easy Git integration
- Great performance

**Steps:**
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign up/login
3. Connect GitHub or upload files
4. Deploy!

---

## 📋 Quick Comparison

| Platform | Difficulty | Free | Custom Domain | Best For |
|----------|-----------|------|---------------|----------|
| **Netlify** | ⭐ Easiest | ✅ Yes | ✅ Yes | Beginners |
| **GitHub Pages** | ⭐⭐ Easy | ✅ Yes | ✅ Yes | Developers |
| **Vercel** | ⭐⭐ Easy | ✅ Yes | ✅ Yes | Performance |
| **Surge.sh** | ⭐⭐⭐ Medium | ✅ Yes | ✅ Yes | Quick deploys |
| **Cloudflare Pages** | ⭐⭐ Easy | ✅ Yes | ✅ Yes | Speed |

---

## 🎯 My Recommendation

**For absolute beginners:** Use **Netlify Drop** - just drag and drop your folder, no account needed for first deploy.

**For ongoing updates:** Use **Netlify** or **Vercel** with Git integration - push code, auto-deploy.

---

## 🔧 Before Deploying

Make sure your files are ready:
- ✅ `index.html`
- ✅ `styles.css`
- ✅ `script.js`
- ✅ `camps-data.json`
- ✅ All in the same folder

**Note:** The website uses `fetch()` to load `camps-data.json`, so it needs to be served over HTTP (not `file://`). All hosting options above will handle this correctly.

---

## 🌐 Adding a Custom Domain (Optional)

All platforms above support custom domains:
1. Buy a domain (e.g., from Namecheap, Google Domains, etc.)
2. In your hosting platform settings, add your domain
3. Update DNS records as instructed
4. Your site will be live on your custom domain!

---

## 📱 Testing Your Deployed Site

After deployment, test:
- ✅ Search functionality
- ✅ Filtering by age/type
- ✅ Map view toggle
- ✅ Clicking camp markers on map
- ✅ All links work
- ✅ Mobile responsiveness

---

## 🆘 Troubleshooting

**Map not showing?**
- Make sure Leaflet CSS/JS loaded (check browser console)
- Some ad blockers may interfere

**JSON not loading?**
- Check browser console for CORS errors
- Ensure `camps-data.json` is in the same directory

**Need help?** Check the hosting platform's documentation or support.
