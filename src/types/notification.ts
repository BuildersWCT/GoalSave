export interface Notification {
  id: string
  type: 'milestone' | 'reminder' | 'achievement' | 'warning'
  title: string
  message: string
  goalId?: string
  goalName?: string
  timestamp: number
  read: boolean
  persistent?: boolean
}

export interface MilestoneConfig {
  percentage: number // e.g., 25, 50, 75, 100
  enabled: boolean
}

export interface NotificationSettings {
  milestones: MilestoneConfig[]
  reminders: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    time: string // HH:mm format
  }
  achievements: {
    enabled: boolean
    types: ('first_goal' | 'goal_completed' | 'streak')[]
  }
  browser: {
    enabled: boolean
    permission: NotificationPermission
  }
}

export interface GoalMilestone {
  goalId: string
  goalName: string
  currentPercentage: number
  previousPercentage: number
  achievedMilestones: number[]
  nextMilestone?: number
}