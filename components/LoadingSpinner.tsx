
import React from 'react';

const LoadingSpinner: React.FC<{ size?: string }> = ({ size = 'h-8 w-8' }) => {
  return (
    <div className={`animate-spin rounded-full ${size} border-b-2 border-sky-500`}></div>
  );
};

export default LoadingSpinner;
