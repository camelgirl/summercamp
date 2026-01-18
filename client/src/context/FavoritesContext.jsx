import { createContext, useContext, useState, useEffect } from 'react';

const FAVORITES_KEY = 'summercamp_favorites';
const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      console.log('Favorites updated:', favorites.length, favorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  const getCampId = (camp) => {
    return camp.name + (camp.category || camp.district ? `_${camp.category || camp.district}` : '');
  };

  const addFavorite = (camp) => {
    const campId = getCampId(camp);
    setFavorites(prev => {
      if (!prev.includes(campId)) {
        const newFavorites = [...prev, campId];
        console.log('Adding favorite:', camp.name, 'New count:', newFavorites.length);
        return newFavorites;
      }
      return prev;
    });
  };

  const removeFavorite = (camp) => {
    const campId = getCampId(camp);
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== campId);
      console.log('Removing favorite:', camp.name, 'New count:', newFavorites.length);
      return newFavorites;
    });
  };

  const toggleFavorite = (camp) => {
    const campId = getCampId(camp);
    setFavorites(prev => {
      if (prev.includes(campId)) {
        const newFavorites = prev.filter(id => id !== campId);
        console.log('Toggling favorite OFF:', camp.name, 'New count:', newFavorites.length);
        return newFavorites;
      } else {
        const newFavorites = [...prev, campId];
        console.log('Toggling favorite ON:', camp.name, 'New count:', newFavorites.length);
        return newFavorites;
      }
    });
  };

  const isFavorite = (camp) => {
    const campId = typeof camp === 'string' ? camp : getCampId(camp);
    return favorites.includes(campId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
