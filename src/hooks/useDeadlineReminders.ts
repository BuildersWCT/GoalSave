import { useEffect, useRef } from 'react'
import { useNotifications } from '../contexts/NotificationContext'
import { calculateDaysUntilDeadline, isDeadlineUrgent } from '../utils/deadlineUtils'

interface Goal {
  id: bigint
  name: string
  lockUntil: bigint
  closed: boolean
}

interface UseDeadlineRemindersProps {
  goals: Goal[] | undefined
  isLoading: boolean
}

/**
 * Hook to send deadline reminders for goals.
 * Sends notifications for urgent deadlines (within 3 days including today) and overdue goals.
 * Notifications are throttled to once per 24 hours per goal.
 */
export function useDeadlineReminders({ goals, isLoading }: UseDeadlineRemindersProps) {
  const { addNotification } = useNotifications()
  const lastCheckRef = useRef<Record<string, number>>({})

  useEffect(() => {
    if (isLoading || !goals) return

    const checkDeadlines = () => {
      const now = Date.now()

      goals.forEach((goal) => {
        if (goal.closed) return

        const goalId = goal.id.toString()
        const daysUntilDeadline = calculateDaysUntilDeadline(goal.lockUntil)
        const isUrgent = isDeadlineUrgent(goal.lockUntil)
        const lastCheck = lastCheckRef.current[goalId] || 0

        // Only send notification if it's been more than 24 hours since last check
        // and deadline is urgent (within 3 days including today) or overdue
        if (now - lastCheck > 24 * 60 * 60 * 1000) {
          if (isUrgent) {
            addNotification({
              id: `deadline-urgent-${goalId}-${now}`,
              type: 'reminder',
              title: 'Goal Deadline Approaching!',
              message: `Your goal "${goal.name}" ${daysUntilDeadline === 0 ? 'is due today' : `is due in ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''}`}. Don't forget to contribute!`,
              timestamp: now,
              goalId,
            })
            lastCheckRef.current[goalId] = now
          } else if (daysUntilDeadline < 0) {
            addNotification({
              id: `deadline-overdue-${goalId}-${now}`,
              type: 'reminder',
              title: 'Goal Deadline Passed',
              message: `Your goal "${goal.name}" is overdue. Consider extending it or completing your contributions.`,
              timestamp: now,
              goalId,
            })
            lastCheckRef.current[goalId] = now
          }
        }
      })
    }

    // Check immediately when component mounts or goals change
    checkDeadlines()

    // Set up interval to check every hour
    const interval = setInterval(checkDeadlines, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [goals, isLoading, addNotification])
}