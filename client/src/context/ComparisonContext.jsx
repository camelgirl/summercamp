import { createContext, useContext, useState } from 'react';

const ComparisonContext = createContext();

export function ComparisonProvider({ children }) {
  const [comparisonCamps, setComparisonCamps] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const addToComparison = (camp) => {
    setComparisonCamps(prev => {
      // Check if camp already in comparison (max 3)
      if (prev.length >= 3) {
        alert('You can compare up to 3 camps at a time. Remove one to add another.');
        return prev;
      }
      if (prev.some(c => c.name === camp.name)) {
        alert('This camp is already in the comparison.');
        return prev;
      }
      const newCamps = [...prev, camp];
      console.log('Added to comparison:', camp.name, 'Total:', newCamps.length);
      return newCamps;
    });
    setShowComparison(true);
  };

  const removeFromComparison = (camp) => {
    setComparisonCamps(prev => {
      const newCamps = prev.filter(c => c.name !== camp.name);
      console.log('Removed from comparison:', camp.name, 'Total:', newCamps.length);
      return newCamps;
    });
  };

  const isInComparison = (camp) => {
    return comparisonCamps.some(c => c.name === camp.name);
  };

  const clearComparison = () => {
    setComparisonCamps([]);
    setShowComparison(false);
  };

  const value = {
    comparisonCamps,
    showComparison,
    setShowComparison,
    addToComparison,
    removeFromComparison,
    isInComparison,
    clearComparison,
    comparisonCount: comparisonCamps.length,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
