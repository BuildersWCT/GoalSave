export interface SavingsTip {
  id: string
  title: string
  description: string
  category: 'general' | 'goal-specific' | 'behavioral'
  priority: 'low' | 'medium' | 'high'
  dismissed: boolean
  saved: boolean
}

export interface SavingsPattern {
  totalGoals: number
  activeGoals: number
  completedGoals: number
  averageProgress: number
  totalSaved: number
  totalTarget: number
  recentActivity: boolean
}

export type TipGenerationResult = {
  tips: SavingsTip[]
  patterns: SavingsPattern
}