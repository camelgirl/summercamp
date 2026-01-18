import './CampCard.css';

function CampCard({ camp }) {
  const formatField = (value, label, icon) => {
    if (!value || value.trim() === '') return null;
    return (
      <div className="camp-info">
        <div className="camp-info-label">
          {icon && <span className="camp-icon">{icon}</span>}
          <strong>{label}:</strong>
        </div>
        <span className="camp-info-value">{value}</span>
      </div>
    );
  };

  const formatLink = (url, text) => {
    if (!url || url.trim() === '') return null;
    const linkText = text || url;
    const href = url.startsWith('http') ? url : `https://${url}`;
    return (
      <div className="camp-info">
        <div className="camp-info-label">
          <span className="camp-icon">🌐</span>
          <strong>Website:</strong>
        </div>
        <a href={href} target="_blank" rel="noopener noreferrer" className="camp-link">
          {linkText.length > 40 ? linkText.substring(0, 40) + '...' : linkText}
          <span className="link-arrow">→</span>
        </a>
      </div>
    );
  };

  return (
    <div className="camp-card">
      <div className="camp-card-header">
        <h2>{camp.name}</h2>
        <div className="camp-badges">
          {camp.district && (
            <span
              className="camp-type district-badge"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              }}
            >
              🎓 {camp.district}
            </span>
          )}
          {camp.type && <span className="camp-type">{camp.type}</span>}
        </div>
      </div>
      
      <div className="camp-card-body">
        {formatLink(camp.website)}
        {formatField(camp.ages, 'Ages', '👶')}
        {formatField(camp.dates, 'Dates', '📅')}
        {formatField(camp.registrationDate, 'Registration', '📝')}
        {formatField(camp.cost, 'Cost', '💰')}
        {formatField(camp.location, 'Location', '📍')}
      </div>
      
      {camp.notes && (
        <div className="notes">
          <div className="notes-header">
            <span className="notes-icon">ℹ️</span>
            <strong>Additional Info</strong>
          </div>
          <p>{camp.notes}</p>
        </div>
      )}
    </div>
  );
}

export default CampCard;
