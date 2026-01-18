# Quick Setup Guide

## 🚀 Getting Started

### Step 1: Install All Dependencies

```bash
npm run install:all
```

This installs dependencies for:
- Root project
- React client (frontend)
- Express server (backend)

### Step 2: Start Development Servers

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000 (React + Vite)
- **Backend**: http://localhost:3001 (Express API)

### Step 3: Open in Browser

Navigate to: **http://localhost:3000**

## 📦 What's Included

- ✅ React 18 with Vite (fast dev server)
- ✅ Express.js API server
- ✅ React Router for navigation
- ✅ React-Leaflet for maps
- ✅ All original functionality preserved
- ✅ Modern component architecture

## 🛠️ Available Commands

- `npm run dev` - Start both frontend and backend
- `npm run build` - Build React app for production
- `npm start` - Start production server
- `npm run install:all` - Install all dependencies

## 📁 Project Structure

```
summercamp/
├── client/          # React frontend
│   └── src/
│       ├── components/  # Header, CampCard, SearchSection, MapView
│       ├── pages/       # CommunityCamps, SchoolDistricts
│       ├── hooks/       # useCamps, useFilteredCamps
│       └── utils/       # geocoding utilities
├── server/          # Express backend
│   └── server.js    # API server
└── *.json          # Data files (same as before)
```

## 🔄 Migration Notes

- Original static files are preserved in root
- New React app uses same data files
- All styles maintained
- Same features, modern architecture
