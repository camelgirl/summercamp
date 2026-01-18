import { useState, useEffect } from 'react';
import './CampComparison.css';

function CampComparison({ camps, onClose, onRemove, isOpen }) {
  const [selectedCamps, setSelectedCamps] = useState(camps || []);

  // Update selected camps when camps prop changes
  useEffect(() => {
    if (camps) {
      setSelectedCamps(camps);
    }
  }, [camps]);

  const removeCamp = (index) => {
    const newCamps = selectedCamps.filter((_, i) => i !== index);
    setSelectedCamps(newCamps);
    if (onRemove) {
      onRemove(newCamps);
    }
    if (newCamps.length === 0 && onClose) {
      onClose();
    }
  };

  if (!isOpen || selectedCamps.length === 0) {
    return null;
  }

  const getField = (camp, field) => {
    return camp[field] || '—';
  };

  const compareField = (field, label, icon = '') => {
    const values = selectedCamps.map(camp => getField(camp, field));
    const allSame = values.every(v => v === values[0]);
    
    return (
      <div className={`comparison-row ${allSame ? 'same' : 'different'}`}>
        <div className="comparison-label">
          {icon && <span className="comparison-icon">{icon}</span>}
          <strong>{label}</strong>
        </div>
        <div className="comparison-values">
          {selectedCamps.map((camp, index) => (
            <div key={index} className="comparison-value">
              {getField(camp, field)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (selectedCamps.length === 0) {
    return null;
  }

  return (
    <div className="comparison-overlay" onClick={onClose}>
      <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comparison-header">
          <h2>📊 Camp Comparison</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="comparison-content">
          <div className="comparison-camps-header">
            {selectedCamps.map((camp, index) => (
              <div key={index} className="comparison-camp-header">
                <button
                  className="remove-camp-btn"
                  onClick={() => removeCamp(index)}
                  aria-label={`Remove ${camp.name}`}
                >
                  ×
                </button>
                <h3>{camp.name}</h3>
                {camp.type && <span className="camp-type-badge">{camp.type}</span>}
              </div>
            ))}
          </div>

          <div className="comparison-body">
            {compareField('website', 'Website', '🌐')}
            {compareField('ages', 'Ages', '👶')}
            {compareField('dates', 'Dates', '📅')}
            {compareField('registrationDate', 'Registration', '📝')}
            {compareField('cost', 'Cost', '💰')}
            {compareField('location', 'Location', '📍')}
            {selectedCamps.some(c => c.notes) && (
              <div className="comparison-row notes-row">
                <div className="comparison-label">
                  <span className="comparison-icon">ℹ️</span>
                  <strong>Notes</strong>
                </div>
                <div className="comparison-values">
                  {selectedCamps.map((camp, index) => (
                    <div key={index} className="comparison-value notes-value">
                      {getField(camp, 'notes')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="comparison-footer">
          <button className="close-comparison-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CampComparison;
