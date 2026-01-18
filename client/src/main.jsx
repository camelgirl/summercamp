import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { ComparisonProvider } from './context/ComparisonContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FavoritesProvider>
        <ComparisonProvider>
          <App />
        </ComparisonProvider>
      </FavoritesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
