import React, { useState } from 'react';
import './RequestForm.css';

const RequestForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    request_text: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.request_text.trim() || !formData.location.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim() || null,
          location: formData.location.trim(),
          request_text: formData.request_text.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      const data = await response.json();
      
      setSuccess(true);
      setFormData({ name: '', location: '', request_text: '' });
      
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="request-form-container">
      <div className="request-form-header">
        <h2>Submit Aid Request</h2>
        <p>Please provide details about the aid you need. Our system will categorize and prioritize your request.</p>
      </div>

      {success && (
        <div className="alert alert-success">
          <strong>Success!</strong> Your request has been submitted successfully.
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Your Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your name"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Location <span className="required">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter your location (e.g., 123 Main St, City, State)"
            disabled={isSubmitting}
          />
          <small className="form-hint">
            Provide as specific a location as possible for faster response
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="request_text" className="form-label">
            Request Details <span className="required">*</span>
          </label>
          <textarea
            id="request_text"
            name="request_text"
            rows={5}
            value={formData.request_text}
            onChange={handleChange}
            required
            className="form-textarea"
            placeholder="Describe what kind of aid you need (food, water, medical supplies, shelter, etc.)..."
            disabled={isSubmitting}
          />
          <small className="form-hint">
            Be as specific as possible. Include quantities, urgency level, and any special requirements.
          </small>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting || !formData.request_text.trim() || !formData.location.trim()}
            className="btn btn-primary submit-button"
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner-small"></span>
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </form>

      <div className="emergency-notice">
        <div className="emergency-icon">⚠️</div>
        <div className="emergency-text">
          <strong>Emergency Notice:</strong> If this is a life-threatening emergency, please call 911 immediately. 
          This system is for non-emergency aid coordination.
        </div>
      </div>
    </div>
  );
};

export default RequestForm;