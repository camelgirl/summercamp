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
  costFilter,
  onCostFilterChange,
  dateFilter,
  onDateFilterChange,
  ratingFilter,
  onRatingFilterChange,
  showAdvanced = false,
  onToggleAdvanced,
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
        <button 
          className="advanced-toggle-btn" 
          onClick={onToggleAdvanced}
          type="button"
        >
          {showAdvanced ? '▼' : '▶'} Advanced
        </button>
      </div>

      {showAdvanced && (
        <div className="advanced-filters">
          <div className="advanced-filter-group">
            <label htmlFor="costFilter">Cost Range</label>
            <select
              id="costFilter"
              value={costFilter || ''}
              onChange={(e) => onCostFilterChange(e.target.value)}
            >
              <option value="">Any Cost</option>
              <option value="free">Free</option>
              <option value="0-100">$0 - $100/week</option>
              <option value="100-200">$100 - $200/week</option>
              <option value="200-300">$200 - $300/week</option>
              <option value="300+">$300+/week</option>
            </select>
          </div>

          <div className="advanced-filter-group">
            <label htmlFor="dateFilter">Date Range</label>
            <select
              id="dateFilter"
              value={dateFilter || ''}
              onChange={(e) => onDateFilterChange(e.target.value)}
            >
              <option value="">Any Dates</option>
              <option value="may">May</option>
              <option value="june">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
              <option value="may-june">May - June</option>
              <option value="june-july">June - July</option>
              <option value="july-august">July - August</option>
            </select>
          </div>

          <div className="advanced-filter-group">
            <label htmlFor="ratingFilter">Minimum Rating</label>
            <select
              id="ratingFilter"
              value={ratingFilter || ''}
              onChange={(e) => onRatingFilterChange(e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2.5">2.5+ Stars</option>
            </select>
          </div>
        </div>
      )}

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
