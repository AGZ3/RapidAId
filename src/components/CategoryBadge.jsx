import React from 'react';
import './CategoryBadge.css';

const CategoryBadge = ({ category, className = '' }) => {
  const getBadgeClass = (category) => {
    const normalizedCategory = category?.toLowerCase() || 'other';
    return `badge badge-${normalizedCategory}`;
  };

  if (!category) return null;

  return (
    <span className={`${getBadgeClass(category)} ${className}`}>
      {category}
    </span>
  );
};

export default CategoryBadge;