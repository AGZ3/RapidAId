import React from 'react';
import { useTranslation } from 'react-i18next';
import RequestForm from '../components/RequestForm.jsx';
import './SubmitRequestPage.css';

const SubmitRequestPage = () => {
  const handleSubmitSuccess = (newRequest) => {
    console.log('Request submitted successfully:', newRequest);
    // You can add additional logic here, like showing a success modal
    // or redirecting to the dashboard after a delay
  };

  const { t } = useTranslation();

  return (
    <div className="submit-page">
      <div className="submit-page-hero">
        <div className="container">
          <h1>{t('submitAidTitle')}</h1>
          <p>{t('submitAidDescription')}</p>
        </div>
      </div>

      <div className="submit-page-content">
        <div className="container">
          <RequestForm onSubmitSuccess={handleSubmitSuccess} />

          <div className="how-it-works">
            <h3>{t('howItWorks')}</h3>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>{t('steps.submit')}</h4>
                  <p>{t('steps.submitDesc')}</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>{t('steps.ai')}</h4>
                  <p>{t('steps.aiDesc')}</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>{t('steps.connect')}</h4>
                  <p>{t('steps.connectDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitRequestPage;