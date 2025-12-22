import { Notification, GoalMilestone } from '../types/notification'

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

interface MilestoneProgress {
  [goalId: string]: {
    lastPercentage: number
    achievedMilestones: number[]
    lastCheck: number
  }
}

class MilestoneDetector {
  private progress: MilestoneProgress = {}
  private notificationCallback: ((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void) | null = null

  setNotificationCallback(callback: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void) {
    this.notificationCallback = callback
  }

  checkGoals(goals: Goal[], enabledMilestones: number[] = [25, 50, 75, 100]) {
    const now = Date.now()
    
    goals.forEach(goal => {
      if (goal.closed || goal.target === 0n) return

      const goalId = goal.id.toString()
      const currentPercentage = this.calculatePercentage(goal.balance, goal.target)
      
      // Initialize progress tracking for new goals
      if (!this.progress[goalId]) {
        this.progress[goalId] = {
          lastPercentage: 0,
          achievedMilestones: [],
          lastCheck: now
        }
      }

      const goalProgress = this.progress[goalId]
      const milestoneReached = this.checkMilestoneReached(
        goalId,
        goal.name,
        goalProgress.lastPercentage,
        currentPercentage,
        enabledMilestones
      )

      // Update progress
      goalProgress.lastPercentage = currentPercentage
      goalProgress.lastCheck = now

      // Add newly achieved milestones
      milestoneReached.newMilestones.forEach(milestone => {
        if (!goalProgress.achievedMilestones.includes(milestone)) {
          goalProgress.achievedMilestones.push(milestone)
        }
      })
    })
  }

  private calculatePercentage(balance: bigint, target: bigint): number {
    if (target === 0n) return 0
    return Math.floor((Number(balance) / Number(target)) * 100)
  }

  private checkMilestoneReached(
    goalId: string,
    goalName: string,
    lastPercentage: number,
    currentPercentage: number,
    enabledMilestones: number[]
  ): { newMilestones: number[] } {
    const newMilestones: number[] = []

    enabledMilestones.forEach(milestone => {
      // Check if we've crossed this milestone
      if (lastPercentage < milestone && currentPercentage >= milestone) {
        newMilestones.push(milestone)
        
        // Trigger notification
        if (this.notificationCallback) {
          const isComplete = milestone === 100
          this.notificationCallback({
            type: 'milestone',
            title: isComplete ? '🎉 Goal Completed!' : `🎯 ${milestone}% Milestone Reached!`,
            message: isComplete 
              ? `Congratulations! You've successfully completed your goal "${goalName}".`
              : `Great progress! You've reached ${milestone}% of your goal "${goalName}".`,
            goalId,
            goalName,
            persistent: isComplete
          })
        }
      }
    })

    return { newMilestones }
  }

  getGoalProgress(goalId: string): GoalMilestone | null {
    const progress = this.progress[goalId]
    if (!progress) return null

    return {
      goalId,
      goalName: '', // This would need to be populated from goal data
      currentPercentage: progress.lastPercentage,
      previousPercentage: progress.lastPercentage,
      achievedMilestones: progress.achievedMilestones,
      nextMilestone: this.getNextMilestone(progress.achievedMilestones)
    }
  }

  private getNextMilestone(achievedMilestones: number[]): number | undefined {
    const allMilestones = [25, 50, 75, 100]
    return allMilestones.find(milestone => !achievedMilestones.includes(milestone))
  }

  resetGoalProgress(goalId: string) {
    delete this.progress[goalId]
  }

  getAllProgress(): MilestoneProgress {
    return { ...this.progress }
  }
}

// Export singleton instance
export const milestoneDetector = new MilestoneDetector()

// Helper function to check if browser notifications are supported
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window
}

// Helper function to request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    return 'denied'
  }

  if (Notification.permission === 'default') {
    return await Notification.requestPermission()
  }

  return Notification.permission
}

// Helper function to check if notification permission is granted
export const hasNotificationPermission = (): boolean => {
  return isNotificationSupported() && Notification.permission === 'granted'
}