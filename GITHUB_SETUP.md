# GitHub Setup Instructions

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Repository name: `austin-summer-camps` (or your preferred name)
3. Description: "Modern React + Node.js app for browsing Austin summer camps"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /Users/yinyanhe/Documents/summercamp

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: React + Node.js summer camps app"

# Add your GitHub repository as remote
# REPLACE YOUR_USERNAME and YOUR_REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Alternative - Using SSH

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## What Gets Pushed

✅ **Included:**
- All source code (React components, server, etc.)
- Data files (camps-data.json, school-district-camps.json)
- Configuration files (package.json, vite.config.js, etc.)
- Documentation (README files)

❌ **Excluded (via .gitignore):**
- node_modules/
- dist/
- build/
- .env files
- Log files

## After Pushing

Your code will be available at:
`https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

## Next Steps

1. **Enable GitHub Pages** (if you want to host it):
   - Go to Settings → Pages
   - Select source: Deploy from a branch
   - Branch: main, folder: /client/dist

2. **Add a README** (optional):
   - The README-REACT.md file can be renamed to README.md

3. **Set up CI/CD** (optional):
   - Add GitHub Actions for automated testing/deployment
