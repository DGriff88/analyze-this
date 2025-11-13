import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
      <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default LoadingSpinner;