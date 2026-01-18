import './CampCard.css';

function CampCard({ camp }) {
  const formatField = (value, label) => {
    if (!value || value.trim() === '') return null;
    return (
      <div className="camp-info">
        <strong>{label}:</strong> <span>{value}</span>
      </div>
    );
  };

  const formatLink = (url, text) => {
    if (!url || url.trim() === '') return null;
    const linkText = text || url;
    const href = url.startsWith('http') ? url : `https://${url}`;
    return (
      <div className="camp-info">
        <strong>Website:</strong>{' '}
        <a href={href} target="_blank" rel="noopener noreferrer">
          {linkText}
        </a>
      </div>
    );
  };

  return (
    <div className="camp-card">
      <h2>{camp.name}</h2>
      {camp.district && (
        <span
          className="camp-type"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          }}
        >
          {camp.district}
        </span>
      )}
      {camp.type && <span className="camp-type">{camp.type}</span>}
      {formatLink(camp.website)}
      {formatField(camp.ages, 'Ages')}
      {formatField(camp.dates, 'Dates')}
      {formatField(camp.registrationDate, 'Registration')}
      {formatField(camp.cost, 'Cost')}
      {formatField(camp.location, 'Location')}
      {camp.notes && <div className="notes">{camp.notes}</div>}
    </div>
  );
}

export default CampCard;
