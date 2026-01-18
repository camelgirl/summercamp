import { useState } from 'react';
import './CampCard.css';
import { useFavorites } from '../hooks/useFavorites';
import { useComparison } from '../context/ComparisonContext';
import { useReviews } from '../hooks/useReviews';
import ReviewList from './ReviewList';

function CampCard({ camp, isInComparison: propIsInComparison }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isInComparison: contextIsInComparison, addToComparison, removeFromComparison } = useComparison();
  const { getCampReviews, getCampRating, addReview, deleteReview } = useReviews();
  const favorite = isFavorite(camp);
  const [showReviews, setShowReviews] = useState(false);
  
  // Check if in comparison (use prop first, then context)
  const inComparison = propIsInComparison !== undefined ? propIsInComparison : contextIsInComparison(camp);
  
  // Get rating and reviews
  const rating = getCampRating(camp.name);
  const reviews = getCampReviews(camp.name);
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
        <div className="camp-card-actions">
          <button
            className={`favorite-button ${favorite ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(camp);
            }}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorite ? '❤️' : '🤍'}
          </button>
          <button
            className={`compare-button ${inComparison ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (inComparison) {
                removeFromComparison(camp);
              } else {
                addToComparison(camp);
              }
            }}
            aria-label={inComparison ? 'Remove from comparison' : 'Add to comparison'}
            title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
          >
            {inComparison ? '⚖️✓' : '⚖️'}
          </button>
        </div>
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

      <div className="camp-reviews-section">
        <div className="rating-summary" onClick={() => setShowReviews(!showReviews)}>
          <div className="rating-stars">
            {rating ? (
              <>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= Math.round(rating) ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
                <span className="rating-value">{rating.toFixed(1)}</span>
                <span className="review-count">({reviews.length})</span>
              </>
            ) : (
              <span className="no-rating">No ratings yet</span>
            )}
          </div>
          <button className="toggle-reviews-btn">
            {showReviews ? '▼ Hide Reviews' : '▶ Show Reviews'}
          </button>
        </div>

        {showReviews && (
          <ReviewList
            campName={camp.name}
            reviews={reviews}
            onAddReview={addReview}
            onDeleteReview={deleteReview}
          />
        )}
      </div>
    </div>
  );
}

export default CampCard;
