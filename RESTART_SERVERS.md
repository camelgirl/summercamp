# Restart Development Servers

## Quick Restart

If servers are already running, stop them first:

```bash
# Stop all Node processes on ports 3000 and 3001
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null
```

Then start the servers:

```bash
cd /Users/yinyanhe/Documents/summercamp
npm run dev
```

## First Time Setup

If you haven't installed dependencies yet:

```bash
cd /Users/yinyanhe/Documents/summercamp

# Install all dependencies (root, client, and server)
npm run install:all

# Then start servers
npm run dev
```

## Manual Start (if npm run dev doesn't work)

### Terminal 1 - Frontend:
```bash
cd /Users/yinyanhe/Documents/summercamp/client
npm install  # if not already done
npm run dev
```

### Terminal 2 - Backend:
```bash
cd /Users/yinyanhe/Documents/summercamp/server
npm install  # if not already done
npm run dev
```

## Access Your App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Endpoint**: http://localhost:3001/api/camps

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Dependencies Not Installed
```bash
npm run install:all
```

### Node.js Not Found
Make sure Node.js is installed:
```bash
node --version  # Should show v16+ or v18+
npm --version   # Should show version number
```

If not installed, download from: https://nodejs.org/
