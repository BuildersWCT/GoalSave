import { calculateDaysUntilDeadline, formatDeadlineCountdown, isDeadlineApproaching, isDeadlineUrgent } from '../deadlineUtils'

describe('deadlineUtils', () => {
  // Test constants for time calculations
  const now = Date.now() / 1000 // Current time in seconds
  const oneDay = 24 * 60 * 60 // One day in seconds
  const threeDays = 3 * oneDay
  const sevenDays = 7 * oneDay

  describe('calculateDaysUntilDeadline', () => {
    it('should calculate positive days for future deadline', () => {
      const futureDeadline = BigInt(Math.floor(now + oneDay))
      const result = calculateDaysUntilDeadline(futureDeadline)
      expect(result).toBe(1)
    })

    it('should calculate negative days for past deadline', () => {
      const pastDeadline = BigInt(Math.floor(now - oneDay))
      const result = calculateDaysUntilDeadline(pastDeadline)
      expect(result).toBe(-1)
    })

    it('should return 0 for deadline today', () => {
      const todayDeadline = BigInt(Math.floor(now + oneDay / 2))
      const result = calculateDaysUntilDeadline(todayDeadline)
      expect(result).toBe(0) // Rounds down to full days
    })

    it('should return 1 for deadline exactly 24 hours from now', () => {
      const tomorrowDeadline = BigInt(Math.floor(now + oneDay))
      const result = calculateDaysUntilDeadline(tomorrowDeadline)
      expect(result).toBe(1)
    })
  })

  describe('formatDeadlineCountdown', () => {
    it('should format overdue deadlines', () => {
      expect(formatDeadlineCountdown(-1)).toBe('Overdue by 1 day')
      expect(formatDeadlineCountdown(-5)).toBe('Overdue by 5 days')
    })

    it('should format due today', () => {
      expect(formatDeadlineCountdown(0)).toBe('Due today')
    })

    it('should format due tomorrow', () => {
      expect(formatDeadlineCountdown(1)).toBe('Due tomorrow')
    })

    it('should format multiple days remaining', () => {
      expect(formatDeadlineCountdown(5)).toBe('5 days remaining')
    })
  })

  describe('isDeadlineApproaching', () => {
    it('should return true for deadlines within 7 days', () => {
      const approachingDeadline = BigInt(Math.floor(now + threeDays))
      expect(isDeadlineApproaching(approachingDeadline)).toBe(true)
    })

    it('should return false for deadlines beyond 7 days', () => {
      const distantDeadline = BigInt(Math.floor(now + sevenDays + oneDay))
      expect(isDeadlineApproaching(distantDeadline)).toBe(false)
    })

    it('should return false for past deadlines', () => {
      const pastDeadline = BigInt(Math.floor(now - oneDay))
      expect(isDeadlineApproaching(pastDeadline)).toBe(false)
    })
  })

  describe('isDeadlineUrgent', () => {
    it('should return true for deadlines within 3 days', () => {
      const urgentDeadline = BigInt(Math.floor(now + oneDay))
      expect(isDeadlineUrgent(urgentDeadline)).toBe(true)
    })

    it('should return false for deadlines beyond 3 days', () => {
      const nonUrgentDeadline = BigInt(Math.floor(now + sevenDays))
      expect(isDeadlineUrgent(nonUrgentDeadline)).toBe(false)
    })

    it('should return false for past deadlines', () => {
      const pastDeadline = BigInt(Math.floor(now - oneDay))
      expect(isDeadlineUrgent(pastDeadline)).toBe(false)
    })
  })
})