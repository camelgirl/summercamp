import { useState } from 'react';
import './ReviewForm.css';

function ReviewForm({ campName, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    onSubmit({
      rating,
      reviewerName: reviewerName.trim() || 'Anonymous',
      comment: comment.trim(),
    });
    
    // Reset form
    setRating(0);
    setReviewerName('');
    setComment('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="review-form-overlay" onClick={onClose}>
      <div className="review-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="review-form-header">
          <h3>Write a Review</h3>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="review-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Camp: {campName}</label>
          </div>

          <div className="form-group">
            <label>Your Rating *</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
              {rating > 0 && (
                <span className="rating-text">
                  {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reviewerName">Your Name (optional)</label>
            <input
              type="text"
              id="reviewerName"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Anonymous"
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="comment">Your Review</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this camp..."
              rows="5"
              maxLength={500}
            />
            <div className="char-count">{comment.length}/500</div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting || rating === 0}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewForm;
