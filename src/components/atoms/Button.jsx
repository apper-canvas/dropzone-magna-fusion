import React from 'react';

const Button = ({ onClick, children, className = '', disabled = false }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;