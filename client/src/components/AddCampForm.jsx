import { useState } from 'react';
import './AddCampForm.css';

function AddCampForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    ages: '',
    dates: '',
    registrationDate: '',
    cost: '',
    location: '',
    type: '',
    district: '',
    notes: '',
  });
  const [status, setStatus] = useState(''); // 'success', 'error', or ''
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    // Basic validation - name is required
    if (!formData.name.trim()) {
      setStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Using Netlify Forms - submit to Netlify
      const formDataToSubmit = new URLSearchParams();
      formDataToSubmit.append('form-name', 'add-camp');
      formDataToSubmit.append('bot-field', ''); // Honeypot field
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key].trim()) {
          formDataToSubmit.append(key, formData[key].trim());
        }
      });

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formDataToSubmit.toString(),
      });

      if (response.ok) {
        setStatus('success');
        // Reset form
        setFormData({
          name: '',
          website: '',
          ages: '',
          dates: '',
          registrationDate: '',
          cost: '',
          location: '',
          type: '',
          district: '',
          notes: '',
        });
        setTimeout(() => {
          setStatus('');
          onClose();
        }, 3000);
      } else {
        const text = await response.text();
        console.error('Form submission error:', response.status, text);
        setStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-camp-overlay" onClick={onClose}>
      <div className="add-camp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="add-camp-header">
          <h2>➕ Add a Summer Camp</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="add-camp-form" onSubmit={handleSubmit} name="add-camp" data-netlify="true" data-netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="add-camp" />
          <input type="hidden" name="bot-field" />

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="name">
                Camp Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., City of Austin Summer Camps"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Camp Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">Select type...</option>
                <option value="Day Camp">Day Camp</option>
                <option value="Overnight Camp">Overnight Camp</option>
                <option value="Sports Camp">Sports Camp</option>
                <option value="Arts Camp">Arts Camp</option>
                <option value="STEM Camp">STEM Camp</option>
                <option value="Adventure Camp">Adventure Camp</option>
                <option value="Specialty Camp">Specialty Camp</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ages">Ages</label>
              <input
                type="text"
                id="ages"
                name="ages"
                value={formData.ages}
                onChange={handleChange}
                placeholder="e.g., 5-12 yrs"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dates">Dates</label>
              <input
                type="text"
                id="dates"
                name="dates"
                value={formData.dates}
                onChange={handleChange}
                placeholder="e.g., June 8 - August 12, 2026"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="registrationDate">Registration Date</label>
              <input
                type="text"
                id="registrationDate"
                name="registrationDate"
                value={formData.registrationDate}
                onChange={handleChange}
                placeholder="e.g., Early registration Jan 31-Feb 6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cost">Cost</label>
              <input
                type="text"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="e.g., $140/week"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Various locations throughout Austin"
              />
            </div>
            <div className="form-group">
              <label htmlFor="district">School District (if applicable)</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g., Austin ISD"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="notes">Additional Information / Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Any additional details about the camp..."
              />
            </div>
          </div>

          {status === 'success' && (
            <div className="form-message success">
              ✓ Thank you! Your camp submission has been received. We'll review and add it to our directory.
            </div>
          )}
          {status === 'error' && (
            <div className="form-message error">
              Please fill in the required fields and try again.
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Camp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCampForm;
