import { useState } from 'react';
import Header from '../components/Header';
import SearchSection from '../components/SearchSection';
import CampCard from '../components/CampCard';
import MapView from '../components/MapView';
import { useCamps, useFilteredCamps } from '../hooks/useCamps';
import { getCampCoordinates } from '../utils/geocoding';
import '../styles.css';

function CommunityCamps() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentView, setCurrentView] = useState('list');

  const { camps, loading, error } = useCamps('/api/camps');
  const filteredCamps = useFilteredCamps(camps, {
    searchTerm,
    ageFilter,
    typeFilter,
    districtFilter: '',
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setAgeFilter('');
    setTypeFilter('');
  };

  if (loading) {
    return (
      <>
        <Header title="🏕️ Austin Summer Camps 2026" subtitle="Find the perfect summer camp for your child" />
        <main className="container">
          <div className="no-results">
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
            <p>Error loading camps. Please refresh the page.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="🏕️ Austin Summer Camps 2026" subtitle="Find the perfect summer camp for your child" />
      <main className="container">
        <SearchSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          ageFilter={ageFilter}
          onAgeFilterChange={setAgeFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
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
                  <CampCard key={index} camp={camp} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <footer>
        <div className="container">
          <p>Data sourced from Austin Summer Camps spreadsheet</p>
          <p>Last updated: January 2026</p>
        </div>
      </footer>
    </>
  );
}

export default CommunityCamps;
