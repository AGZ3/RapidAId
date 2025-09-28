import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'unclaimed':
        return {
          text: 'Unclaimed',
          className: 'status-unclaimed'
        };
      case 'claimed':
        return {
          text: 'Claimed',
          className: 'status-claimed'
        };
      case 'completed':
        return {
          text: 'Completed',
          className: 'status-completed'
        };
      case 'pending':
        // Backward compatibility - treat 'pending' as 'unclaimed'
        return {
          text: 'Unclaimed',
          className: 'status-unclaimed'
        };
      default:
        return {
          text: 'Unknown',
          className: 'status-unknown'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`status-badge ${config.className}`}>
      {config.text}
    </span>
  );
};

export default StatusBadge;