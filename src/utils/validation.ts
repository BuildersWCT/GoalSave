export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface FieldValidation {
  isValid: boolean;
  errors: ValidationError[];
  touched: boolean;
  isValidating: boolean;
}

export interface FormValidationState {
  name: FieldValidation;
  token: FieldValidation;
  target: FieldValidation;
  lockUntil: FieldValidation;
}

// Validation rules
const validateGoalName = (value: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!value.trim()) {
    errors.push({
      field: 'name',
      message: 'Goal name is required',
      type: 'error'
    });
  } else if (value.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'Goal name must be at least 2 characters',
      type: 'error'
    });
  } else if (value.trim().length > 100) {
    errors.push({
      field: 'name',
      message: 'Goal name must not exceed 100 characters',
      type: 'error'
    });
  }
  
  return errors;
};

const validateTokenAddress = (value: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!value.trim()) {
    // Default to CELO if not provided
    return errors;
  }
  
  // Check if it's a valid Ethereum address format
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!ethAddressRegex.test(value)) {
    errors.push({
      field: 'token',
      message: 'Invalid token address format',
      type: 'error'
    });
  }
  
  return errors;
};

const validateTargetAmount = (value: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!value.trim()) {
    errors.push({
      field: 'target',
      message: 'Target amount is required',
      type: 'error'
    });
  } else {
    const target = parseFloat(value);
    if (isNaN(target) || target <= 0) {
      errors.push({
        field: 'target',
        message: 'Target amount must be a positive number',
        type: 'error'
      });
    } else if (target > 1000000000) {
      errors.push({
        field: 'target',
        message: 'Target amount is too large',
        type: 'warning'
      });
    }
  }
  
  return errors;
};

const validateLockUntil = (value: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!value.trim()) {
    // Optional field, no validation needed
    return errors;
  }
  
  const lockUntil = parseInt(value);
  if (isNaN(lockUntil) || lockUntil < 0) {
    errors.push({
      field: 'lockUntil',
      message: 'Lock until must be a valid timestamp',
      type: 'error'
    });
  } else {
    const now = Math.floor(Date.now() / 1000);
    if (lockUntil < now) {
      errors.push({
        field: 'lockUntil',
        message: 'Lock until must be in the future',
        type: 'warning'
      });
    }
  }
  
  return errors;
};

// Main validation function
export const validateForm = (values: {
  name: string;
  token: string;
  target: string;
  lockUntil: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // Validate each field
  errors.push(...validateGoalName(values.name));
  errors.push(...validateTokenAddress(values.token));
  errors.push(...validateTargetAmount(values.target));
  errors.push(...validateLockUntil(values.lockUntil));
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Field-specific validation
export const validateField = (field: string, value: string): ValidationError[] => {
  switch (field) {
    case 'name':
      return validateGoalName(value);
    case 'token':
      return validateTokenAddress(value);
    case 'target':
      return validateTargetAmount(value);
    case 'lockUntil':
      return validateLockUntil(value);
    default:
      return [];
  }
};

// Initialize field validation state
export const createInitialFieldValidation = (): FieldValidation => ({
  isValid: false,
  errors: [],
  touched: false,
  isValidating: false
});

// Initialize form validation state
export const createInitialFormValidation = (): FormValidationState => ({
  name: createInitialFieldValidation(),
  token: createInitialFieldValidation(),
  target: createInitialFieldValidation(),
  lockUntil: createInitialFieldValidation()
});

// Get field errors by field name
export const getFieldErrors = (errors: ValidationError[], fieldName: string): ValidationError[] => {
  return errors.filter(error => error.field === fieldName);
};

// Check if form is valid
export const isFormValid = (validationState: FormValidationState): boolean => {
  return Object.values(validationState).every(field => field.isValid);
};