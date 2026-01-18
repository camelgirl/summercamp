import { useState } from 'react';
import Header from '../components/Header';
import SearchSection from '../components/SearchSection';
import CampCard from '../components/CampCard';
import MapView from '../components/MapView';
import { useCamps, useFilteredCamps } from '../hooks/useCamps';
import { getCampCoordinates } from '../utils/geocoding';
import '../styles.css';

function SchoolDistricts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [currentView, setCurrentView] = useState('list');

  const { camps, loading, error } = useCamps('/api/school-districts');
  const filteredCamps = useFilteredCamps(camps, {
    searchTerm,
    ageFilter,
    typeFilter: '',
    districtFilter,
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setAgeFilter('');
    setDistrictFilter('');
  };

  if (loading) {
    return (
      <>
        <Header title="🎓 School District Summer Programs" subtitle="Austin area school district summer camps and programs" />
        <main className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading programs...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="🎓 School District Summer Programs" subtitle="Austin area school district summer camps and programs" />
        <main className="container">
          <div className="no-results">
            <p>Error loading programs. Please refresh the page.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="🎓 School District Summer Programs" subtitle="Austin area school district summer camps and programs" />
      <main className="container">
        <div className="intro-section">
          <p>
            These programs are offered by Austin area school districts. Many are free or low-cost for
            district students. Check eligibility requirements and registration dates carefully.
          </p>
        </div>

        <SearchSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          ageFilter={ageFilter}
          onAgeFilterChange={setAgeFilter}
          districtFilter={districtFilter}
          onDistrictFilterChange={setDistrictFilter}
          onClearFilters={handleClearFilters}
          resultsCount={filteredCamps.length}
          currentView={currentView}
          onViewChange={setCurrentView}
          showDistrictFilter={true}
        />

        {currentView === 'map' ? (
          <MapView camps={filteredCamps} getCoordinates={getCampCoordinates} />
        ) : (
          <>
            {filteredCamps.length === 0 ? (
              <div className="no-results">
                <p>No programs found matching your criteria. Try adjusting your search or filters.</p>
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
          <p>School district program information sourced from official district websites</p>
          <p>Last updated: January 2026</p>
        </div>
      </footer>
    </>
  );
}

export default SchoolDistricts;
