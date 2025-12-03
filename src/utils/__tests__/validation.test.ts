import { 
  validateForm, 
  validateField, 
  validateGoalName,
  validateTokenAddress,
  validateTargetAmount,
  validateLockUntil,
  createInitialFormValidation
} from '../validation'

describe('Validation Utils', () => {
  describe('validateGoalName', () => {
    it('should return error for empty goal name', () => {
      const errors = validateGoalName('')
      expect(errors).toHaveLength(1)
      expect(errors[0]).toMatchObject({
        field: 'name',
        message: 'Goal name is required',
        type: 'error'
      })
    })

    it('should return error for goal name too short', () => {
      const errors = validateGoalName('A')
      expect(errors).toHaveLength(1)
      expect(errors[0]).toMatchObject({
        field: 'name',
        message: 'Goal name must be at least 2 characters',
        type: 'error'
      })
    })

    it('should return error for goal name too long', () => {
      const longName = 'A'.repeat(101)
      const errors = validateGoalName(longName)
      expect(errors).toHaveLength(1)
      expect(errors[0]).toMatchObject({
        field: 'name',
        message: 'Goal name must not exceed 100 characters',
        type: 'error'
      })
    })

    it('should return no errors for valid goal name', () => {
      const errors = validateGoalName('Save for vacation')
      expect(errors).toHaveLength(0)
    })
  })

  describe('validateTokenAddress', () => {
    it('should return no errors for empty token (uses default CELO)', () => {
      const errors = validateTokenAddress('')
      expect(errors).toHaveLength(0)
    })

    it('should return error for invalid token address format', () => {
      const errors = validateTokenAddress('invalid-address')
      expect(errors).toHaveLength(1)
      expect(errors[0]).toMatchObject({
        field: 'token',
        message: 'Invalid token address format',
        type: 'error'
      })
    })

    it('should return no errors for valid token address', () => {
      const validAddress = '0x1234567890123456789012345678901234567890'
      const errors = validateTokenAddress(validAddress)
      expect(errors).toHaveLength(0)
    })
  })

  describe('validateTargetAmount', () => {
    it('should return error for empty target amount', () => {
      const errors = validateTargetAmount('')
      expect(errors).toHaveLength(1)
      expect(errors[0]).toMatchObject({
        field: 'target',
        message: 'Target amount is required',
        type: 'error'
      })
    })

    it('should return error for negative target amount', () => {
      const errors = validateTargetAmount('-10')
      expect(errors).toHaveLength(1)
      expect(errors[0]).toMatchObject({
        field: 'target',
        message: 'Target amount must be a positive number',
        type: 'error'
      })
    })

    it('should return warning for very large target amount', () => {
      const errors = validateTargetAmount('2000000000')
      expect(errors).toHaveLength(1)
      expect(errors[0]).toMatchObject({
        field: 'target',
        message: 'Target amount is too large',
        type: 'warning'
      })
    })

    it('should return no errors for valid target amount', () => {
      const errors = validateTargetAmount('1000')
      expect(errors).toHaveLength(0)
    })
  })

  describe('validateLockUntil', () => {
    it('should return no errors for empty lock until (optional field)', () => {
      const errors = validateLockUntil('')
      expect(errors).toHaveLength(0)
    })

    it('should return error for negative lock until', () => {
      const errors = validateLockUntil('-10')
      expect(errors).toHaveLength(1)
      expect(errors[0]).toMatchObject({
        field: 'lockUntil',
        message: 'Lock until must be a valid timestamp',
        type: 'error'
      })
    })

    it('should return warning for past lock until', () => {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 1000
      const errors = validateLockUntil(pastTimestamp.toString())
      expect(errors).toHaveLength(1)
      expect(errors[0]).toMatchObject({
        field: 'lockUntil',
        message: 'Lock until must be in the future',
        type: 'warning'
      })
    })

    it('should return no errors for valid future lock until', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 1000000
      const errors = validateLockUntil(futureTimestamp.toString())
      expect(errors).toHaveLength(0)
    })
  })

  describe('validateField', () => {
    it('should validate goal name field', () => {
      const errors = validateField('name', '')
      expect(errors).toHaveLength(1)
      expect(errors[0].field).toBe('name')
    })

    it('should validate token field', () => {
      const errors = validateField('token', 'invalid')
      expect(errors).toHaveLength(1)
      expect(errors[0].field).toBe('token')
    })

    it('should validate target field', () => {
      const errors = validateField('target', '')
      expect(errors).toHaveLength(1)
      expect(errors[0].field).toBe('target')
    })

    it('should validate lockUntil field', () => {
      const errors = validateField('lockUntil', 'invalid')
      expect(errors).toHaveLength(1)
      expect(errors[0].field).toBe('lockUntil')
    })

    it('should return empty array for unknown field', () => {
      const errors = validateField('unknown', 'value')
      expect(errors).toHaveLength(0)
    })
  })

  describe('validateForm', () => {
    it('should return invalid for form with errors', () => {
      const result = validateForm({
        name: '',
        token: 'invalid',
        target: '-10',
        lockUntil: ''
      })
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(3)
    })

    it('should return valid for form without errors', () => {
      const result = validateForm({
        name: 'Save for vacation',
        token: '0x1234567890123456789012345678901234567890',
        target: '1000',
        lockUntil: ''
      })
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('createInitialFormValidation', () => {
    it('should create initial validation state', () => {
      const state = createInitialFormValidation()
      expect(state).toHaveProperty('name')
      expect(state).toHaveProperty('token')
      expect(state).toHaveProperty('target')
      expect(state).toHaveProperty('lockUntil')
      
      Object.values(state).forEach(field => {
        expect(field).toHaveProperty('isValid', false)
        expect(field).toHaveProperty('errors', [])
        expect(field).toHaveProperty('touched', false)
        expect(field).toHaveProperty('isValidating', false)
      })
    })
  })
})