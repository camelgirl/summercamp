import { useState } from 'react';
import './Subscribe.css';

function Subscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // 'success', 'error', or ''
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Using Netlify Forms - submit to Netlify
      const formData = new URLSearchParams();
      formData.append('form-name', 'subscribe');
      formData.append('email', email);
      formData.append('bot-field', ''); // Honeypot field

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus(''), 5000);
      } else {
        // Try to get error message
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

  return (
    <div className="subscribe-banner">
      <div className="container">
        <div className="subscribe-content">
          <div className="subscribe-text">
            <h3>📧 Stay Updated</h3>
            <p>Get the latest summer camp information and updates delivered to your inbox</p>
          </div>
          <form 
            className="subscribe-form" 
            onSubmit={handleSubmit}
            name="subscribe"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
          >
            <input type="hidden" name="form-name" value="subscribe" />
            <input type="hidden" name="bot-field" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="subscribe-input"
            />
            <button 
              type="submit" 
              className="subscribe-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
        {status === 'success' && (
          <div className="subscribe-message success">
            ✓ Thank you! You've been subscribed to our updates.
          </div>
        )}
        {status === 'error' && (
          <div className="subscribe-message error">
            Please enter a valid email address.
          </div>
        )}
      </div>
    </div>
  );
}

export default Subscribe;
