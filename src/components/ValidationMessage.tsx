import React from 'react';
import { ValidationError } from '../utils/validation';

interface ValidationMessageProps {
  errors: ValidationError[];
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  errors,
  className = ''
}) => {
  if (errors.length === 0) return null;

  return (
    <div className={`validation-message ${className}`} role="alert" aria-live="polite">
      {errors.map((error, index) => (
        <div
          key={index}
          className={`validation-message-item validation-message-item--${error.type}`}
          aria-label={`Validation ${error.type}: ${error.message}`}
        >
          {error.type === 'error' && (
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="validation-message-icon"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
          {error.type === 'warning' && (
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="validation-message-icon"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="m12 17 .01 0" />
            </svg>
          )}
          <span className="validation-message-text">{error.message}</span>
        </div>
      ))}
    </div>
  );
};