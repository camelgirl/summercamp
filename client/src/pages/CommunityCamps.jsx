import { useState } from 'react';
import Header from '../components/Header';
import Subscribe from '../components/Subscribe';
import SearchSection from '../components/SearchSection';
import CampCard from '../components/CampCard';
import MapView from '../components/MapView';
import AddCampForm from '../components/AddCampForm';
import CampComparison from '../components/CampComparison';
import { useComparison } from '../context/ComparisonContext';
import { useReviews } from '../hooks/useReviews';
import { useCamps, useFilteredCamps } from '../hooks/useCamps';
import { getCampCoordinates } from '../utils/geocoding';
import '../styles.css';

function CommunityCamps() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [costFilter, setCostFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentView, setCurrentView] = useState('list');
  const [isAddCampOpen, setIsAddCampOpen] = useState(false);
  const { 
    comparisonCamps, 
    showComparison, 
    setShowComparison, 
    isInComparison,
    removeFromComparison 
  } = useComparison();

  const { camps, loading, error } = useCamps('/api/camps');
  const { getCampRating } = useReviews();
  
  // Filter camps with rating filter
  const preFilteredCamps = useFilteredCamps(camps, {
    searchTerm,
    ageFilter,
    typeFilter,
    districtFilter: '',
    costFilter,
    dateFilter,
  });
  
  // Apply rating filter
  const filteredCamps = ratingFilter 
    ? preFilteredCamps.filter(camp => {
        const rating = getCampRating(camp.name);
        return rating && rating >= parseFloat(ratingFilter);
      })
    : preFilteredCamps;

  // Debug logging
  console.log('CommunityCamps - camps:', camps.length, 'filtered:', filteredCamps.length, 'loading:', loading, 'error:', error);

  const handleClearFilters = () => {
    setSearchTerm('');
    setAgeFilter('');
    setTypeFilter('');
    setCostFilter('');
    setDateFilter('');
    setRatingFilter('');
  };

  if (loading) {
    return (
      <>
        <Header title="🏕️ Austin Summer Camps 2026" subtitle="Find the perfect summer camp for your child" />
        <main className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading camps...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="🏕️ Austin Summer Camps 2026" subtitle="Find the perfect summer camp for your child" />
        <main className="container">
          <div className="no-results">
            <p>Error loading camps: {error}</p>
            <p>Please check the browser console for more details and refresh the page.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="🏕️ Austin Summer Camps 2026" subtitle="Find the perfect summer camp for your child" />
      <Subscribe />
      <main className="container">
        <div className="add-camp-section">
          <button 
            className="add-camp-button" 
            onClick={() => setIsAddCampOpen(true)}
            aria-label="Add a camp"
          >
            <span className="button-icon">➕</span>
            Add a Camp
          </button>
        </div>
        <SearchSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          ageFilter={ageFilter}
          onAgeFilterChange={setAgeFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          costFilter={costFilter}
          onCostFilterChange={setCostFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          ratingFilter={ratingFilter}
          onRatingFilterChange={setRatingFilter}
          showAdvanced={showAdvanced}
          onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
          onClearFilters={handleClearFilters}
          resultsCount={filteredCamps.length}
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        {currentView === 'map' ? (
          <MapView camps={filteredCamps} getCoordinates={getCampCoordinates} />
        ) : (
          <>
            {filteredCamps.length === 0 ? (
              <div className="no-results">
                <p>No camps found matching your criteria. Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="camps-grid">
                {filteredCamps.map((camp, index) => (
                  <CampCard 
                    key={index} 
                    camp={camp} 
                    isInComparison={isInComparison(camp)}
                  />
                ))}
              </div>
            )}
          </>
        )}
        {comparisonCamps.length > 0 && (
          <div className="comparison-fab" onClick={() => setShowComparison(true)}>
            ⚖️ Compare ({comparisonCamps.length})
          </div>
        )}
      </main>
      <AddCampForm isOpen={isAddCampOpen} onClose={() => setIsAddCampOpen(false)} />
      {showComparison && (
        <CampComparison
          camps={comparisonCamps}
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
          onRemove={(newCamps) => {
            // Remove camps that are not in newCamps
            comparisonCamps.forEach(camp => {
              if (!newCamps.some(c => c.name === camp.name)) {
                removeFromComparison(camp);
              }
            });
          }}
        />
      )}
      <footer>
        <div className="container">
          <p>Email: <a href="mailto:camelgirl.summercamp@gmail.com">camelgirl.summercamp@gmail.com</a></p>
          <p>Last updated: January 2026</p>
        </div>
      </footer>
    </>
  );
}

export default CommunityCamps;
