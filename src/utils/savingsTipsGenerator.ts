import { SavingsTip, SavingsPattern, TipGenerationResult } from '../types/savingsTips'

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

export function generateSavingsTips(goals: Goal[] | undefined): TipGenerationResult {
  const tips: SavingsTip[] = []
  const patterns: SavingsPattern = {
    totalGoals: goals?.length || 0,
    activeGoals: goals?.filter(g => !g.closed).length || 0,
    completedGoals: goals?.filter(g => g.closed).length || 0,
    averageProgress: 0,
    totalSaved: 0,
    totalTarget: 0,
    recentActivity: false // For now, assume no recent activity tracking
  }

  if (!goals || goals.length === 0) {
    tips.push({
      id: 'no-goals',
      title: 'Start Your Savings Journey',
      description: 'Create your first savings goal to begin building wealth.',
      category: 'general',
      priority: 'high',
      dismissed: false,
      saved: false
    })
    return { tips, patterns }
  }

  // Calculate patterns
  let totalSaved = 0
  let totalTarget = 0
  let totalProgress = 0

  goals.forEach(goal => {
    const saved = Number(goal.balance) / 1e18
    const target = Number(goal.target) / 1e18
    totalSaved += saved
    totalTarget += target
    totalProgress += saved / target
  })

  patterns.averageProgress = totalProgress / goals.length
  patterns.totalSaved = totalSaved
  patterns.totalTarget = totalTarget

  // Generate tips based on patterns

  // General tips
  if (patterns.activeGoals > 5) {
    tips.push({
      id: 'too-many-goals',
      title: 'Focus on Fewer Goals',
      description: 'Having too many active goals can spread your savings thin. Consider consolidating or prioritizing.',
      category: 'behavioral',
      priority: 'medium',
      dismissed: false,
      saved: false
    })
  }

  if (patterns.averageProgress < 0.3) {
    tips.push({
      id: 'low-progress',
      title: 'Increase Your Savings Rate',
      description: 'Your goals are progressing slowly. Try increasing your regular contributions.',
      category: 'behavioral',
      priority: 'high',
      dismissed: false,
      saved: false
    })
  }

  if (patterns.completedGoals > 0) {
    tips.push({
      id: 'celebrate-success',
      title: 'Celebrate Your Wins',
      description: `You've completed ${patterns.completedGoals} goal(s)! Keep up the momentum.`,
      category: 'general',
      priority: 'low',
      dismissed: false,
      saved: false
    })
  }

  // Goal-specific tips
  goals.forEach(goal => {
    const progress = Number(goal.balance) / Number(goal.target)
    if (progress >= 0.9 && !goal.closed) {
      tips.push({
        id: `near-completion-${goal.id}`,
        title: `Almost There: ${goal.name}`,
        description: 'You\'re close to reaching your goal! A final push could get you there.',
        category: 'goal-specific',
        priority: 'high',
        dismissed: false,
        saved: false
      })
    }
  })

  // Add some general tips
  tips.push({
    id: 'automate-savings',
    title: 'Automate Your Savings',
    description: 'Set up automatic transfers to make saving effortless.',
    category: 'general',
    priority: 'medium',
    dismissed: false,
    saved: false
  })

  tips.push({
    id: 'review-goals',
    title: 'Review Your Goals Regularly',
    description: 'Check your progress monthly and adjust as needed.',
    category: 'general',
    priority: 'low',
    dismissed: false,
    saved: false
  })

  return { tips, patterns }
}