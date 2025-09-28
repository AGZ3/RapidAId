import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './RequestForm.css';
import geminiService from '../services/geminiService';

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
      setError(t('requiredFields'));
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🚀 Starting request processing with Gemini AI...');
      
      // Process request with Gemini AI categorization
      const processedRequest = await geminiService.categorizeRequest({
        name: formData.name.trim() || '',
        location: formData.location.trim(),
        request_text: formData.request_text.trim()
      });

      console.log('✅ Request successfully processed and categorized!');

      setSuccess(true);
      setFormData({ name: '', location: '', request_text: '' });

      if (onSubmitSuccess) {
        onSubmitSuccess(processedRequest);
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('❌ Error processing request:', err);
      
      if (err.message.includes('API key')) {
        setError('Gemini API key not configured. Please check your environment variables.');
      } else if (err.message.includes('quota') || err.message.includes('limit')) {
        setError('AI service temporarily unavailable. Please try again later.');
      } else {
        setError('Failed to process request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="request-form-container">
      <div className="request-form-header">
        <h2>{t('submitAidTitle')}</h2>
        <p>{t('submitAidDescription')}</p>
      </div>

      {success && (
        <div className="alert alert-success">
          {t('successSubmitted')}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <strong>{t('error')}:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            {t('name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder={t('placeholders.name')}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            {t('location')} <span className="required">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="form-input"
            placeholder={t('placeholders.location')}
            disabled={isSubmitting}
          />
          <small className="form-hint">
            {t('hints.location')}
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="request_text" className="form-label">
            {t('requestDetails')} <span className="required">*</span>
          </label>
          <textarea
            id="request_text"
            name="request_text"
            rows={5}
            value={formData.request_text}
            onChange={handleChange}
            required
            className="form-textarea"
            placeholder={t('placeholders.requestDetails')}
            disabled={isSubmitting}
          />
          <small className="form-hint">
            {t('hints.requestDetails')}
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
                {t('submitting')}
              </>
            ) : (
              t('submit')
            )}
          </button>
        </div>
      </form>

      <div className="emergency-notice">
        <div className="emergency-icon">⚠️</div>
        <div className="emergency-text">
          <strong>{t('emergency.title')}</strong> {t('emergency.text')}
        </div>
      </div>
    </div>
  );
};

export default RequestForm;