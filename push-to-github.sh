#!/bin/bash

# GitHub Push Script with Token Authentication
# Load environment variables if .env file exists
if [ -f .env ]; then
    # Source .env file properly, handling spaces and special characters
    set -a
    source .env
    set +a
fi

echo "🚀 Pushing to GitHub..."
echo ""

# Get GitHub details from environment or prompt
if [ -z "$GITHUB_USERNAME" ]; then
    read -p "GitHub Username: " GITHUB_USERNAME
fi

if [ -z "$GITHUB_REPO_NAME" ]; then
    read -p "Repository Name: " GITHUB_REPO_NAME
fi

if [ -z "$GITHUB_TOKEN" ]; then
    echo ""
    echo "GitHub Personal Access Token required for authentication."
    echo "Get one at: https://github.com/settings/tokens"
    echo "Required scopes: repo (full control of private repositories)"
    read -sp "GitHub Token: " GITHUB_TOKEN
    echo ""
fi

# Validate inputs
if [ -z "$GITHUB_USERNAME" ] || [ -z "$GITHUB_REPO_NAME" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: Missing required information (username, repo name, or token)"
    exit 1
fi

# Add remote with token authentication
# Remove any whitespace from token
GITHUB_TOKEN=$(echo "$GITHUB_TOKEN" | tr -d '[:space:]')
GITHUB_USERNAME=$(echo "$GITHUB_USERNAME" | tr -d '[:space:]')
GITHUB_REPO_NAME=$(echo "$GITHUB_REPO_NAME" | tr -d '[:space:]')

REMOTE_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}.git"

# Remove existing remote if it exists
git remote remove origin 2>/dev/null

# Add new remote
git remote add origin "$REMOTE_URL"

# Set branch to main
git branch -M main

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Done! Your code is now on GitHub at:"
    echo "   https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   1. Repository exists on GitHub"
    echo "   2. Token has correct permissions (repo scope)"
    echo "   3. Token is valid and not expired"
    exit 1
fi
