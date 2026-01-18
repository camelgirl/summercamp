import { useState } from 'react';
import ReviewForm from './ReviewForm';
import './ReviewList.css';

function ReviewList({ campName, reviews, onAddReview, onDeleteReview }) {
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  const hasMore = reviews.length > 3;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="review-list">
      <div className="review-list-header">
        <h4>Reviews ({reviews.length})</h4>
        <button 
          className="add-review-btn"
          onClick={() => setShowForm(true)}
        >
          + Write Review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews yet. Be the first to review this camp!</p>
          <button 
            className="add-review-btn-small"
            onClick={() => setShowForm(true)}
          >
            Write First Review
          </button>
        </div>
      ) : (
        <>
          <div className="reviews-container">
            {displayedReviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-name">{review.reviewerName}</div>
                    <div className="review-date">{formatDate(review.createdAt)}</div>
                  </div>
                  <div className="review-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= review.rating ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <div className="review-comment">{review.comment}</div>
                )}
                {onDeleteReview && (
                  <button
                    className="delete-review-btn"
                    onClick={() => onDeleteReview(review.id)}
                    aria-label="Delete review"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              className="show-more-reviews"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
            </button>
          )}
        </>
      )}

      {showForm && (
        <ReviewForm
          campName={campName}
          onClose={() => setShowForm(false)}
          onSubmit={(review) => {
            onAddReview(campName, review);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

export default ReviewList;
