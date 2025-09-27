import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import SubmitRequestPage from './pages/SubmitRequestPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<SubmitRequestPage />} />
            <Route path="/submit" element={<SubmitRequestPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
