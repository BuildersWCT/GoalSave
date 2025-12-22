import { milestoneDetector } from '../milestoneDetector'
import { Notification } from '../../types/notification'

// Mock goal data for testing
const mockGoals = [
  {
    id: 1n,
    name: 'Emergency Fund',
    token: '0x0000000000000000000000000000000000000000',
    target: 1000n,
    balance: 250n, // 25% progress
    createdAt: Date.now() - 86400000, // 1 day ago
    lockUntil: 0n,
    closed: false
  },
  {
    id: 2n,
    name: 'Vacation Fund',
    token: '0x0000000000000000000000000000000000000000',
    target: 2000n,
    balance: 500n, // 25% progress
    createdAt: Date.now() - 43200000, // 12 hours ago
    lockUntil: 0n,
    closed: false
  }
]

describe('MilestoneDetector', () => {
  let notifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[] = []

  beforeEach(() => {
    // Clear notifications array before each test
    notifications = []
    
    // Mock the notification callback
    milestoneDetector.setNotificationCallback((notification) => {
      notifications.push(notification)
    })
  })

  test('should detect 25% milestone', () => {
    milestoneDetector.checkGoals(mockGoals, [25, 50, 75, 100])
    
    expect(notifications).toHaveLength(2)
    expect(notifications[0].type).toBe('milestone')
    expect(notifications[0].title).toContain('25% Milestone Reached!')
    expect(notifications[0].goalName).toBe('Emergency Fund')
  })

  test('should not detect milestones below threshold', () => {
    const lowProgressGoals = [
      {
        ...mockGoals[0],
        balance: 100n // Only 10% progress
      }
    ]
    
    milestoneDetector.checkGoals(lowProgressGoals, [25, 50, 75, 100])
    
    expect(notifications).toHaveLength(0)
  })

  test('should track milestone progress correctly', () => {
    // First check - should trigger 25% milestones
    milestoneDetector.checkGoals(mockGoals, [25, 50, 75, 100])
    expect(notifications).toHaveLength(2)
    
    // Second check with no change - should not trigger new notifications
    milestoneDetector.checkGoals(mockGoals, [25, 50, 75, 100])
    expect(notifications).toHaveLength(2) // Should still be 2
    
    // Update goals to 50% progress
    const updatedGoals = mockGoals.map(goal => ({
      ...goal,
      balance: goal.target / 2n
    }))
    
    milestoneDetector.checkGoals(updatedGoals, [25, 50, 75, 100])
    expect(notifications).toHaveLength(4) // Should have 2 more notifications for 50%
  })

  test('should handle goal completion', () => {
    const completedGoals = mockGoals.map(goal => ({
      ...goal,
      balance: goal.target // 100% progress
    }))
    
    milestoneDetector.checkGoals(completedGoals, [25, 50, 75, 100])
    
    const completionNotifications = notifications.filter(n => n.title.includes('Goal Completed'))
    expect(completionNotifications).toHaveLength(2)
    expect(completionNotifications[0].persistent).toBe(true)
  })

  test('should reset goal progress', () => {
    milestoneDetector.checkGoals(mockGoals, [25, 50, 75, 100])
    expect(notifications).toHaveLength(2)
    
    milestoneDetector.resetGoalProgress('1')
    
    // Progress should be reset, next check should trigger 25% again
    milestoneDetector.checkGoals(mockGoals, [25, 50, 75, 100])
    expect(notifications).toHaveLength(4) // 2 more for the reset goal
  })
})

describe('Notification utilities', () => {
  test('should check if notifications are supported', () => {
    // This test depends on the environment
    // In a browser environment, this should return true
    // In Node.js environment, this might return false
    const supported = typeof window !== 'undefined' && 'Notification' in window
    expect(typeof supported).toBe('boolean')
  })

  test('should handle notification permission states', () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      // Test different permission states
      const permission = Notification.permission
      expect(['default', 'granted', 'denied']).toContain(permission)
    }
  })
})