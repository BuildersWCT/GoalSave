import { useEffect } from 'react'
import { useNotifications } from '../contexts/NotificationContext'
import { isDeadlineApproaching, isDeadlineUrgent, calculateDaysUntilDeadline, formatDeadlineCountdown } from '../utils/deadlineUtils'

interface Goal {
  id: bigint
  name: string
  token: string
  target: bigint
  balance: bigint
  createdAt: bigint
  lockUntil: bigint
  closed: boolean
  archived: boolean
}

interface UseDeadlineRemindersProps {
  goals: Goal[] | undefined
  isLoading: boolean
}

/**
 * Hook to manage deadline reminders for goals
 * Checks for approaching and urgent deadlines and sends notifications
 */
export function useDeadlineReminders({ goals, isLoading }: UseDeadlineRemindersProps) {
  const { addNotification } = useNotifications()

  useEffect(() => {
    if (isLoading || !goals) return

    const now = Date.now()
    const lastCheckKey = 'goalsave-last-deadline-check'
    const lastCheck = localStorage.getItem(lastCheckKey)
    const lastCheckTime = lastCheck ? parseInt(lastCheck, 10) : 0

    // Only check once per day to avoid spam
    const oneDay = 24 * 60 * 60 * 1000
    if (now - lastCheckTime < oneDay) return

    goals.forEach(goal => {
      if (goal.closed || goal.archived) return

      const days = calculateDaysUntilDeadline(goal.lockUntil)
      const message = formatDeadlineCountdown(days)

      if (isDeadlineUrgent(goal.lockUntil)) {
        addNotification({
          type: 'warning',
          title: `Urgent Deadline: ${goal.name}`,
          message: `Goal deadline is approaching: ${message}`
        })
      } else if (isDeadlineApproaching(goal.lockUntil)) {
        addNotification({
          type: 'info',
          title: `Deadline Reminder: ${goal.name}`,
          message: `Goal deadline is approaching: ${message}`
        })
      }
    })

    // Update last check time
    localStorage.setItem(lastCheckKey, now.toString())
  }, [goals, isLoading, addNotification])
}