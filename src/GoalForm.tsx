import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CeloSaveABI } from './CeloSaveABI'
import { ValidationIcon } from './components/ValidationIcon'
import { ValidationMessage } from './components/ValidationMessage'
import {
  validateField,
  validateForm,
  createInitialFormValidation,
  isFormValid,
  FormValidationState
} from './utils/validation'
import { useNotifications } from '../contexts/NotificationContext'
import { errorLogger } from '../utils/errorLogger'

const CONTRACT_ADDRESS = '0xF9Ba5E30218B24C521500Fe880eE8eaAd2897055' as `0x${string}`

interface GoalFormProps {
  onGoalCreated: () => void
  onGoalUpdated?: () => void
  initialGoal?: {
    name: string
    token: string
    target: string
    lockUntil: string
  }
  isEditing?: boolean
}

export function GoalForm({ onGoalCreated, onGoalUpdated, initialGoal, isEditing = false }: GoalFormProps) {
  const { t } = useTranslation()
  const { addNotification } = useNotifications()
  const [name, setName] = useState(initialGoal?.name || '')
  const [token, setToken] = useState(initialGoal?.token || '0x0000000000000000000000000000000000000000') // CELO
  const [target, setTarget] = useState(initialGoal?.target || '')
  const [lockUntil, setLockUntil] = useState(initialGoal?.lockUntil || '')
  const [validationState, setValidationState] = useState<FormValidationState>(createInitialFormValidation())
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false)

  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract()

  const { isLoading: isConfirming, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  })

  // Get current form values
  const formValues = useMemo(() => ({
    name,
    token,
    target,
    lockUntil
  }), [name, token, target, lockUntil])

  // Validate individual field
  const validateFieldValue = useCallback((field: string, value: string) => {
    const errors = validateField(field, value)
    const isValid = errors.length === 0

    setValidationState(prev => ({
      ...prev,
      [field]: {
        isValid,
        errors,
        touched: true,
        isValidating: false
      }
    }))

    return isValid
  }, [])

  // Handle field blur
  const handleFieldBlur = useCallback((field: string, value: string) => {
    validateFieldValue(field, value)
  }, [validateFieldValue])

  // Handle field change with real-time validation
  const handleFieldChange = useCallback((field: string, value: string, setter: (value: string) => void) => {
    setter(value)

    // Only validate if field has been touched or if it's a subsequent change
    if (validationState[field as keyof FormValidationState]?.touched) {
      // Add a small delay for real-time validation to avoid too frequent updates
      setTimeout(() => {
        validateFieldValue(field, value)
      }, 300)
    }
  }, [validationState, validateFieldValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitAttempted(true)

    // Mark all fields as touched
    const touchedState = Object.keys(validationState).reduce((acc, field) => ({
      ...acc,
      [field]: { ...validationState[field as keyof FormValidationState], touched: true }
    }), {} as FormValidationState)

    setValidationState(touchedState)

    // Validate all fields
    const isValid = validateForm(formValues).isValid

    if (!isValid) {
      // Re-validate all fields to show errors
      Object.keys(formValues).forEach(field => {
        const value = formValues[field as keyof typeof formValues]
        validateFieldValue(field, value)
      })
      return
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CeloSaveABI,
        functionName: 'createGoal',
        args: [name, token as `0x${string}`, BigInt(target), BigInt(lockUntil || '0')],
      })
    } catch (error) {
      errorLogger.logError(error as Error, 'GoalForm.handleSubmit')
      addNotification({
        type: 'warning',
        title: t('goalCreationFailed'),
        message: error instanceof Error ? error.message : t('unknownError'),
      })
    }
  }

  // Reset form when transaction is confirmed
  React.useEffect(() => {
    if (hash && !isConfirming && !confirmError) {
      onGoalCreated()
      setName('')
      setTarget('')
      setLockUntil('')
      setValidationState(createInitialFormValidation())
      setIsSubmitAttempted(false)
    }
  }, [hash, isConfirming, confirmError, onGoalCreated])

  // Get field validation state
  const getFieldState = useCallback((field: string) => {
    const fieldValidation = validationState[field as keyof FormValidationState]
    const errors = fieldValidation?.errors || []
    const hasErrors = errors.some(error => error.type === 'error')
    const hasWarnings = errors.some(error => error.type === 'warning')
    const isValid = fieldValidation?.isValid || false
    const isValidating = fieldValidation?.isValidating || false
    const touched = fieldValidation?.touched || false

    return {
      hasErrors,
      hasWarnings,
      isValid,
      isValidating,
      touched,
      errors
    }
  }, [validationState])

  // Check if form is valid
  const isFormCurrentlyValid = useMemo(() => {
    return isFormValid(validationState)
  }, [validationState])

  // Get form submission state
  const canSubmit = useMemo(() => {
    return !isPending && !isConfirming && (isFormCurrentlyValid || !isSubmitAttempted)
  }, [isPending, isConfirming, isFormCurrentlyValid, isSubmitAttempted])

  return (
    <div className={`goal-form ${isPending || isConfirming ? 'form--loading' : ''}`}>
      <h3>{isEditing ? t('editGoal') : t('createGoal')}</h3>
      
      {/* Show form-level errors if submission was attempted */}
      {isSubmitAttempted && !isFormCurrentlyValid && (
        <div className="form-summary" role="alert" aria-labelledby="form-errors-title">
          <h4 id="form-errors-title">Please fix the following errors:</h4>
          <ul>
            {Object.entries(validationState).map(([field, fieldValidation]) => 
              fieldValidation.errors.map((error, index) => (
                <li key={`${field}-${index}`}>
                  <a 
                    href={`#${field}-field`}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(`${field}-input`)?.focus()
                    }}
                  >
                    {error.message}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Goal Name Field */}
        <div className="form-field" id="name-field">
          <div className="form-input-wrapper">
            <input
              id="name-input"
              type="text"
              placeholder={t('goalNamePlaceholder')}
              value={name}
              onChange={(e) => handleFieldChange('name', e.target.value, setName)}
              onBlur={(e) => handleFieldBlur('name', e.target.value)}
              aria-describedby={getFieldState('name').errors.length > 0 ? 'name-error' : undefined}
              aria-invalid={getFieldState('name').hasErrors}
              className={`
                ${getFieldState('name').hasErrors ? 'form-field--has-error' : ''}
                ${getFieldState('name').hasWarnings ? 'form-field--has-warning' : ''}
                ${getFieldState('name').isValid && getFieldState('name').touched ? 'form-field--is-valid' : ''}
              `}
              required
            />
            <ValidationIcon
              isValid={getFieldState('name').isValid}
              isValidating={getFieldState('name').isValidating}
              hasErrors={getFieldState('name').hasErrors}
              hasWarnings={getFieldState('name').hasWarnings}
            />
          </div>
          <ValidationMessage 
            errors={getFieldState('name').errors}
            className="field-validation"
          />
        </div>

        {/* Token Address Field */}
        <div className="form-field" id="token-field">
          <div className="form-input-wrapper">
            <input
              id="token-input"
              type="text"
              placeholder={t('tokenAddressPlaceholder')}
              value={token}
              onChange={(e) => handleFieldChange('token', e.target.value, setToken)}
              onBlur={(e) => handleFieldBlur('token', e.target.value)}
              aria-describedby={getFieldState('token').errors.length > 0 ? 'token-error' : undefined}
              aria-invalid={getFieldState('token').hasErrors}
              className={`
                ${getFieldState('token').hasErrors ? 'form-field--has-error' : ''}
                ${getFieldState('token').hasWarnings ? 'form-field--has-warning' : ''}
                ${getFieldState('token').isValid && getFieldState('token').touched ? 'form-field--is-valid' : ''}
              `}
            />
            <ValidationIcon
              isValid={getFieldState('token').isValid}
              isValidating={getFieldState('token').isValidating}
              hasErrors={getFieldState('token').hasErrors}
              hasWarnings={getFieldState('token').hasWarnings}
            />
          </div>
          <ValidationMessage 
            errors={getFieldState('token').errors}
            className="field-validation"
          />
        </div>

        {/* Target Amount Field */}
        <div className="form-field" id="target-field">
          <div className="form-input-wrapper">
            <input
              id="target-input"
              type="number"
              placeholder={t('targetAmountPlaceholder')}
              value={target}
              onChange={(e) => handleFieldChange('target', e.target.value, setTarget)}
              onBlur={(e) => handleFieldBlur('target', e.target.value)}
              aria-describedby={getFieldState('target').errors.length > 0 ? 'target-error' : undefined}
              aria-invalid={getFieldState('target').hasErrors}
              className={`
                ${getFieldState('target').hasErrors ? 'form-field--has-error' : ''}
                ${getFieldState('target').hasWarnings ? 'form-field--has-warning' : ''}
                ${getFieldState('target').isValid && getFieldState('target').touched ? 'form-field--is-valid' : ''}
              `}
              required
              min="0"
              step="0.01"
            />
            <ValidationIcon
              isValid={getFieldState('target').isValid}
              isValidating={getFieldState('target').isValidating}
              hasErrors={getFieldState('target').hasErrors}
              hasWarnings={getFieldState('target').hasWarnings}
            />
          </div>
          <ValidationMessage 
            errors={getFieldState('target').errors}
            className="field-validation"
          />
        </div>

        {/* Lock Until Field */}
        <div className="form-field" id="lockUntil-field">
          <div className="form-input-wrapper">
            <input
              id="lockUntil-input"
              type="number"
              placeholder={t('lockUntilPlaceholder')}
              value={lockUntil}
              onChange={(e) => handleFieldChange('lockUntil', e.target.value, setLockUntil)}
              onBlur={(e) => handleFieldBlur('lockUntil', e.target.value)}
              aria-describedby={getFieldState('lockUntil').errors.length > 0 ? 'lockUntil-error' : 'lockUntil-help'}
              aria-invalid={getFieldState('lockUntil').hasErrors}
              className={`
                ${getFieldState('lockUntil').hasErrors ? 'form-field--has-error' : ''}
                ${getFieldState('lockUntil').hasWarnings ? 'form-field--has-warning' : ''}
                ${getFieldState('lockUntil').isValid && getFieldState('lockUntil').touched ? 'form-field--is-valid' : ''}
              `}
              min="0"
            />
            <ValidationIcon
              isValid={getFieldState('lockUntil').isValid}
              isValidating={getFieldState('lockUntil').isValidating}
              hasErrors={getFieldState('lockUntil').hasErrors}
              hasWarnings={getFieldState('lockUntil').hasWarnings}
            />
          </div>
          <div id="lockUntil-help" className="field-help" style={{ fontSize: '0.875rem', color: 'var(--text-color)', opacity: 0.7, marginTop: '0.25rem' }}>
            Unix timestamp (optional)
          </div>
          <ValidationMessage 
            errors={getFieldState('lockUntil').errors}
            className="field-validation"
          />
        </div>

        <div className="form-buttons">
          <button
            type="submit"
            disabled={!canSubmit}
            aria-describedby={!canSubmit && isSubmitAttempted ? 'submit-error' : undefined}
          >
            {isPending ? t('creating') : isConfirming ? t('waiting') : isEditing ? t('saveChanges') : t('createButton')}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={() => {
                if (onGoalUpdated) onGoalUpdated()
              }}
              disabled={isPending || isConfirming}
              className="btn-cancel"
            >
              {t('cancel')}
            </button>
          )}
        </div>

         {!canSubmit && isSubmitAttempted && (
           <div id="submit-error" className="submit-error" style={{
             fontSize: '0.875rem',
             color: '#e53e3e',
             marginTop: '0.5rem',
             display: 'block'
           }}>
             Please fix the form errors before submitting.
           </div>
         )}
      </form>
    </div>
  )
}