# Austin Summer Camps - React + Node.js Version

Modern React + Node.js application for browsing Austin summer camps.

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Maps**: React-Leaflet
- **Routing**: React Router v6
- **Styling**: CSS Modules + CSS Variables

## 📁 Project Structure

```
summercamp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles.css      # Global styles
│   └── package.json
├── server/                 # Express backend
│   ├── server.js          # API server
│   └── package.json
├── camps-data.json        # Community camps data
├── school-district-camps.json  # School district data
└── package.json           # Root package.json
```

## 🛠️ Setup & Installation

### 1. Install Dependencies

```bash
npm run install:all
```

This will install dependencies for:
- Root project (concurrently for running both servers)
- React client
- Express server

### 2. Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000 (Vite dev server)
- **Backend**: http://localhost:3001 (Express API)

### 3. Build for Production

```bash
npm run build
```

This builds the React app to `client/dist/`

### 4. Production Server

```bash
npm start
```

Starts the Express server which serves the built React app and API.

## 📡 API Endpoints

- `GET /api/camps` - Returns all community camps
- `GET /api/school-districts` - Returns all school district programs

## 🎨 Features

- ✅ Modern React components with hooks
- ✅ Server-side API for data
- ✅ Interactive map with React-Leaflet
- ✅ Search and filtering
- ✅ Responsive design
- ✅ Fast development with Vite
- ✅ Production-ready build

## 🔄 Migration from Static Site

The old static files are still in the root directory:
- `index.html` (old)
- `school-districts.html` (old)
- `script.js` (old)
- `styles.css` (copied to `client/src/styles.css`)

The new React app uses the same data files:
- `camps-data.json`
- `school-district-camps.json`

## 🚢 Deployment

### Option 1: Deploy to Vercel/Netlify

1. Build the app: `npm run build`
2. Deploy `client/dist` to Vercel or Netlify
3. Deploy server separately or use serverless functions

### Option 2: Deploy Full Stack

1. Build: `npm run build`
2. Start server: `npm start`
3. Server serves both API and React app

## 📝 Development Notes

- Frontend hot-reloads on file changes (Vite)
- Backend uses `--watch` flag for auto-restart
- API proxy configured in `vite.config.js`
- All styles maintained from original design
