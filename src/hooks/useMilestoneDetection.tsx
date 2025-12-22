import { useEffect, useRef } from 'react'
import { useNotifications } from '../contexts/NotificationContext'
import { milestoneDetector } from '../utils/milestoneDetector'

interface Goal {
  id: bigint
  name: string
  token: string
  target: bigint
  balance: bigint
  createdAt: bigint
  lockUntil: bigint
  closed: boolean
}

interface UseMilestoneDetectionProps {
  goals: Goal[] | undefined
  isLoading: boolean
  checkInterval?: number // in milliseconds
}

export function useMilestoneDetection({ 
  goals, 
  isLoading, 
  checkInterval = 30000 // Check every 30 seconds by default
}: UseMilestoneDetectionProps) {
  const { addNotification, settings } = useNotifications()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastCheckRef = useRef<number>(0)

  // Set up the notification callback
  useEffect(() => {
    milestoneDetector.setNotificationCallback((notification) => {
      addNotification(notification)
    })

    return () => {
      milestoneDetector.setNotificationCallback(() => {})
    }
  }, [addNotification])

  // Check milestones when goals change
  useEffect(() => {
    if (!isLoading && goals && goals.length > 0) {
      const enabledMilestones = settings.milestones
        .filter(m => m.enabled)
        .map(m => m.percentage)
      
      milestoneDetector.checkGoals(goals, enabledMilestones)
      lastCheckRef.current = Date.now()
    }
  }, [goals, isLoading, settings.milestones])

  // Set up periodic checking
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      if (!isLoading && goals && goals.length > 0) {
        const now = Date.now()
        // Only check if it's been at least checkInterval since last check
        if (now - lastCheckRef.current >= checkInterval) {
          const enabledMilestones = settings.milestones
            .filter(m => m.enabled)
            .map(m => m.percentage)
          
          milestoneDetector.checkGoals(goals, enabledMilestones)
          lastCheckRef.current = now
        }
      }
    }, checkInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [goals, isLoading, checkInterval, settings.milestones])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Check for achievement notifications
  useEffect(() => {
    if (!isLoading && goals) {
      checkAchievements(goals)
    }
  }, [goals, isLoading])

  const checkAchievements = (goalsList: Goal[]) => {
    // Check for first goal achievement
    if (goalsList.length === 1 && settings.achievements.enabled && settings.achievements.types.includes('first_goal')) {
      const goal = goalsList[0]
      // Only show if goal has some balance
      if (goal.balance > 0n) {
        addNotification({
          type: 'achievement',
          title: '🏆 First Goal Created!',
          message: `Welcome to GoalSave! You've created your first goal "${goal.name}". Keep up the great work!`,
          goalId: goal.id.toString(),
          goalName: goal.name,
          persistent: true
        })
      }
    }

    // Check for goal completion achievements
    if (settings.achievements.enabled && settings.achievements.types.includes('goal_completed')) {
      goalsList.forEach(goal => {
        if (goal.balance >= goal.target && goal.target > 0n) {
          const currentPercentage = Math.floor((Number(goal.balance) / Number(goal.target)) * 100)
          if (currentPercentage >= 100) {
            addNotification({
              type: 'achievement',
              title: '🎊 Goal Master!',
              message: `Amazing! You've achieved 100% of your goal "${goal.name}". You're a goal-crushing champion!`,
              goalId: goal.id.toString(),
              goalName: goal.name,
              persistent: true
            })
          }
        }
      })
    }
  }

  // Browser notification permission handling
  useEffect(() => {
    if (settings.browser.enabled && 'Notification' in window) {
      if (Notification.permission === 'default') {
        // Request permission when enabled
        Notification.requestPermission().then(() => {
          // Permission status will be handled by the notification context
        })
      }
    }
  }, [settings.browser.enabled])

  return {
    // Expose any useful methods or data if needed
    lastCheck: lastCheckRef.current
  }
}