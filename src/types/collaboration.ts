export interface Collaborator {
  id: string
  address: string
  name?: string
  avatar?: string
  joinedAt: number
  role: 'owner' | 'contributor'
  totalContributed: bigint
  contributionCount: number
  lastContribution: number
}

export interface CollaborationInvite {
  id: string
  goalId: string
  inviterAddress: string
  inviteeAddress: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  createdAt: number
  expiresAt: number
  message?: string
}

export interface Contribution {
  id: string
  goalId: string
  contributorAddress: string
  amount: bigint
  timestamp: number
  transactionHash: string
  note?: string
}

export interface GoalCollaboration {
  goalId: string
  isCollaborative: boolean
  collaborators: Collaborator[]
  pendingInvites: CollaborationInvite[]
  contributions: Contribution[]
  totalContributions: bigint
  settings: CollaborationSettings
}

export interface CollaborationSettings {
  allowPublicContributions: boolean
  requireApproval: boolean
  minimumContribution?: bigint
  maximumContributors: number
  contributionDeadline?: number
}

export interface LeaderboardEntry {
  address: string
  name?: string
  totalContributed: bigint
  goalsContributed: number
  rank: number
  avatar?: string
}

export interface CollaborationStats {
  totalCollaborativeGoals: number
  totalContributors: number
  totalContributions: bigint
  averageContribution: bigint
  topContributors: LeaderboardEntry[]
}