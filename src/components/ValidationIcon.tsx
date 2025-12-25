import React from 'react';

interface ValidationIconProps {
  isValid: boolean;
  isValidating: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
  className?: string;
}

export const ValidationIcon: React.FC<ValidationIconProps> = ({
  isValid,
  isValidating,
  hasErrors,
  hasWarnings,
  className = ''
}) => {
  if (isValidating) {
    return (
      <div className={`validation-icon validation-icon--loading ${className}`} role="status" aria-label="Validating">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className={`validation-icon validation-icon--error ${className}`} role="alert" aria-label="Validation error">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
    );
  }

  if (hasWarnings && !hasErrors) {
    return (
      <div className={`validation-icon validation-icon--warning ${className}`} role="alert" aria-label="Validation warning">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="m12 17 .01 0" />
        </svg>
      </div>
    );
  }

  if (isValid) {
    return (
      <div className={`validation-icon validation-icon--success ${className}`} role="status" aria-label="Valid">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4" />
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
          <path d="M15 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
        </svg>
      </div>
    );
  }

  return null;
};