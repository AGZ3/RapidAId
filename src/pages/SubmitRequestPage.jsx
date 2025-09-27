import React from 'react';
import RequestForm from '../components/RequestForm.jsx';
import './SubmitRequestPage.css';

const SubmitRequestPage = () => {
  const handleSubmitSuccess = (newRequest) => {
    console.log('Request submitted successfully:', newRequest);
    // You can add additional logic here, like showing a success modal
    // or redirecting to the dashboard after a delay
  };

  return (
    <div className="submit-page">
      <div className="submit-page-hero">
        <div className="container">
          <h1>Request Emergency Aid</h1>
          <p>Submit your aid request and our AI system will categorize and prioritize it to connect you with the right resources quickly.</p>
        </div>
      </div>

      <div className="submit-page-content">
        <div className="container">
          <RequestForm onSubmitSuccess={handleSubmitSuccess} />
          
          <div className="how-it-works">
            <h3>How It Works</h3>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Submit Your Request</h4>
                  <p>Provide your location and describe what aid you need</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>AI Categorization</h4>
                  <p>Our system automatically categorizes and prioritizes your request</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Get Connected</h4>
                  <p>Local responders and aid providers will see your request and respond</p>
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