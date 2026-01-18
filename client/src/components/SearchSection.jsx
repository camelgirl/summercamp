import { useState } from 'react';
import './SearchSection.css';

function SearchSection({
  searchTerm,
  onSearchChange,
  ageFilter,
  onAgeFilterChange,
  typeFilter,
  onTypeFilterChange,
  districtFilter,
  onDistrictFilterChange,
  onClearFilters,
  resultsCount,
  currentView,
  onViewChange,
  showDistrictFilter = false,
}) {
  return (
    <div className="search-section">
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search camps by name, type, or location..."
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="filters">
        {showDistrictFilter && (
          <select
            id="districtFilter"
            value={districtFilter}
            onChange={(e) => onDistrictFilterChange(e.target.value)}
          >
            <option value="">All Districts</option>
            <option value="Austin ISD">Austin ISD</option>
            <option value="Round Rock ISD">Round Rock ISD</option>
          </select>
        )}

        <select
          id="ageFilter"
          value={ageFilter}
          onChange={(e) => onAgeFilterChange(e.target.value)}
        >
          <option value="">All Ages</option>
          <option value="3">3 and under</option>
          <option value="4">4 and under</option>
          <option value="5">5 and under</option>
          <option value="6">6 and under</option>
          <option value="7">7 and under</option>
          <option value="8">8 and under</option>
          <option value="9">9 and under</option>
          <option value="10">10 and under</option>
          <option value="12">12 and under</option>
          <option value="13">13 and under</option>
          <option value="14">14 and under</option>
          <option value="16">16 and under</option>
        </select>

        {!showDistrictFilter && (
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Day Camp">Day Camp</option>
            <option value="Overnight Camp">Overnight Camp</option>
          </select>
        )}

        <button id="clearFilters" className="clear-btn" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="results-count">
        <span>{resultsCount}</span> {resultsCount === 1 ? 'camp' : 'camps'} found
      </div>

      <div className="view-toggle">
        <button
          className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
          onClick={() => onViewChange('list')}
        >
          📋 List View
        </button>
        <button
          className={`view-btn ${currentView === 'map' ? 'active' : ''}`}
          onClick={() => onViewChange('map')}
        >
          🗺️ Map View
        </button>
      </div>
    </div>
  );
}

export default SearchSection;
