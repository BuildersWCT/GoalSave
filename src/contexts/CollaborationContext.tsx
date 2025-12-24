import React, { createContext, useReducer, useEffect, ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { GoalCollaboration, Collaborator, CollaborationInvite, Contribution, CollaborationSettings, LeaderboardEntry } from '../types/collaboration'

interface CollaborationContextType {
  collaborations: Map<string, GoalCollaboration>
  leaderboard: LeaderboardEntry[]
  createCollaborativeGoal: (goalId: string, settings?: Partial<CollaborationSettings>) => void
  inviteCollaborator: (goalId: string, inviteeAddress: string, message?: string) => Promise<void>
  acceptInvite: (inviteId: string) => Promise<void>
  declineInvite: (inviteId: string) => Promise<void>
  addContribution: (goalId: string, contributorAddress: string, amount: bigint, transactionHash: string, note?: string) => void
  getGoalCollaboration: (goalId: string) => GoalCollaboration | undefined
  getUserCollaborations: (userAddress: string) => GoalCollaboration[]
  getPendingInvites: (userAddress: string) => CollaborationInvite[]
  updateLeaderboard: () => void
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined)

const defaultSettings: CollaborationSettings = {
  allowPublicContributions: false,
  requireApproval: false,
  maximumContributors: 10,
}

type CollaborationAction =
  | { type: 'CREATE_COLLABORATION'; payload: { goalId: string; settings: CollaborationSettings } }
  | { type: 'ADD_COLLABORATOR'; payload: { goalId: string; collaborator: Collaborator } }
  | { type: 'ADD_INVITE'; payload: CollaborationInvite }
  | { type: 'UPDATE_INVITE'; payload: { inviteId: string; status: CollaborationInvite['status'] } }
  | { type: 'ADD_CONTRIBUTION'; payload: Contribution }
  | { type: 'UPDATE_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'LOAD_COLLABORATIONS'; payload: Map<string, GoalCollaboration> }

const collaborationReducer = (
  state: { collaborations: Map<string, GoalCollaboration>; leaderboard: LeaderboardEntry[] },
  action: CollaborationAction
) => {
  switch (action.type) {
    case 'CREATE_COLLABORATION': {
      const newCollaboration: GoalCollaboration = {
        goalId: action.payload.goalId,
        isCollaborative: true,
        collaborators: [],
        pendingInvites: [],
        contributions: [],
        totalContributions: 0n,
        settings: { ...defaultSettings, ...action.payload.settings }
      }
      const newCollaborations = new Map(state.collaborations)
      newCollaborations.set(action.payload.goalId, newCollaboration)
      return { ...state, collaborations: newCollaborations }
    }

    case 'ADD_COLLABORATOR': {
      const collaboration = state.collaborations.get(action.payload.goalId)
      if (!collaboration) return state

      const updatedCollaboration = {
        ...collaboration,
        collaborators: [...collaboration.collaborators, action.payload.collaborator]
      }
      const newCollaborations = new Map(state.collaborations)
      newCollaborations.set(action.payload.goalId, updatedCollaboration)
      return { ...state, collaborations: newCollaborations }
    }

    case 'ADD_INVITE': {
      const collaboration = state.collaborations.get(action.payload.goalId)
      if (!collaboration) return state

      const updatedCollaboration = {
        ...collaboration,
        pendingInvites: [...collaboration.pendingInvites, action.payload]
      }
      const newCollaborations = new Map(state.collaborations)
      newCollaborations.set(action.payload.goalId, updatedCollaboration)
      return { ...state, collaborations: newCollaborations }
    }

    case 'UPDATE_INVITE': {
      const newCollaborations = new Map(state.collaborations)
      for (const [goalId, collaboration] of newCollaborations) {
        const inviteIndex = collaboration.pendingInvites.findIndex(invite => invite.id === action.payload.inviteId)
        if (inviteIndex !== -1) {
          const updatedInvites = [...collaboration.pendingInvites]
          updatedInvites[inviteIndex] = { ...updatedInvites[inviteIndex], status: action.payload.status }
          newCollaborations.set(goalId, { ...collaboration, pendingInvites: updatedInvites })
          break
        }
      }
      return { ...state, collaborations: newCollaborations }
    }

    case 'ADD_CONTRIBUTION': {
      const collaboration = state.collaborations.get(action.payload.goalId)
      if (!collaboration) return state

      const updatedCollaboration = {
        ...collaboration,
        contributions: [...collaboration.contributions, action.payload],
        totalContributions: collaboration.totalContributions + action.payload.amount
      }

      // Update collaborator stats
      const collaboratorIndex = updatedCollaboration.collaborators.findIndex(
        c => c.address === action.payload.contributorAddress
      )
      if (collaboratorIndex !== -1) {
        const collaborator = updatedCollaboration.collaborators[collaboratorIndex]
        updatedCollaboration.collaborators[collaboratorIndex] = {
          ...collaborator,
          totalContributed: collaborator.totalContributed + action.payload.amount,
          contributionCount: collaborator.contributionCount + 1,
          lastContribution: action.payload.timestamp
        }
      }

      const newCollaborations = new Map(state.collaborations)
      newCollaborations.set(action.payload.goalId, updatedCollaboration)
      return { ...state, collaborations: newCollaborations }
    }

    case 'UPDATE_LEADERBOARD':
      return { ...state, leaderboard: action.payload }

    case 'LOAD_COLLABORATIONS':
      return { ...state, collaborations: action.payload }

    default:
      return state
  }
}

interface CollaborationProviderProps {
  children: ReactNode
}

export function CollaborationProvider({ children }: CollaborationProviderProps) {
  const [state, dispatch] = useReducer(collaborationReducer, {
    collaborations: new Map(),
    leaderboard: []
  })

  const { address } = useAccount()

  // Load collaborations from localStorage on mount
  useEffect(() => {
    const savedCollaborations = localStorage.getItem('goalsave-collaborations')
    if (savedCollaborations) {
      try {
        const collaborationsData = JSON.parse(savedCollaborations)
        const collaborationsMap = new Map(Object.entries(collaborationsData)) as Map<string, GoalCollaboration>
        dispatch({ type: 'LOAD_COLLABORATIONS', payload: collaborationsMap })
      } catch (error) {
        console.error('Failed to load collaborations from localStorage:', error)
      }
    }
  }, [])

  // Save collaborations to localStorage whenever they change
  useEffect(() => {
    const collaborationsObject = Object.fromEntries(state.collaborations)
    localStorage.setItem('goalsave-collaborations', JSON.stringify(collaborationsObject))
  }, [state.collaborations])

  const createCollaborativeGoal = (goalId: string, settings?: Partial<CollaborationSettings>) => {
    dispatch({
      type: 'CREATE_COLLABORATION',
      payload: { goalId, settings: { ...defaultSettings, ...settings } }
    })
  }

  const inviteCollaborator = async (goalId: string, inviteeAddress: string, message?: string): Promise<void> => {
    const invite: CollaborationInvite = {
      id: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      goalId,
      inviterAddress: address || 'current-user-address',
      inviteeAddress,
      status: 'pending',
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      message
    }

    dispatch({ type: 'ADD_INVITE', payload: invite })
  }

  const acceptInvite = async (inviteId: string): Promise<void> => {
    dispatch({ type: 'UPDATE_INVITE', payload: { inviteId, status: 'accepted' } })

    // Find the invite and add collaborator
    const invite = Array.from(state.collaborations.values())
      .flatMap(c => c.pendingInvites)
      .find(i => i.id === inviteId)

    if (invite) {
      const collaborator: Collaborator = {
        id: `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        address: invite.inviteeAddress,
        joinedAt: Date.now(),
        role: 'contributor',
        totalContributed: 0n,
        contributionCount: 0,
        lastContribution: 0
      }

      dispatch({ type: 'ADD_COLLABORATOR', payload: { goalId: invite.goalId, collaborator } })
    }
  }

  const declineInvite = async (inviteId: string): Promise<void> => {
    dispatch({ type: 'UPDATE_INVITE', payload: { inviteId, status: 'declined' } })
  }

  const addContribution = (
    goalId: string,
    contributorAddress: string,
    amount: bigint,
    transactionHash: string,
    note?: string
  ) => {
    const contribution: Contribution = {
      id: `contrib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      goalId,
      contributorAddress,
      amount,
      timestamp: Date.now(),
      transactionHash,
      note
    }

    dispatch({ type: 'ADD_CONTRIBUTION', payload: contribution })
  }

  const getGoalCollaboration = (goalId: string): GoalCollaboration | undefined => {
    return state.collaborations.get(goalId)
  }

  const getUserCollaborations = (userAddress: string): GoalCollaboration[] => {
    return Array.from(state.collaborations.values()).filter(collaboration =>
      collaboration.collaborators.some(c => c.address === userAddress)
    )
  }

  const getPendingInvites = (userAddress: string): CollaborationInvite[] => {
    return Array.from(state.collaborations.values())
      .flatMap(c => c.pendingInvites)
      .filter(invite => invite.inviteeAddress === userAddress && invite.status === 'pending')
  }

  const updateLeaderboard = () => {
    const contributorStats = new Map<string, { totalContributed: bigint; goalsContributed: number; name?: string }>()

    // Aggregate contribution data
    for (const collaboration of state.collaborations.values()) {
      for (const collaborator of collaboration.collaborators) {
        const existing = contributorStats.get(collaborator.address) || {
          totalContributed: 0n,
          goalsContributed: 0,
          name: collaborator.name
        }

        contributorStats.set(collaborator.address, {
          totalContributed: existing.totalContributed + collaborator.totalContributed,
          goalsContributed: existing.goalsContributed + 1,
          name: collaborator.name
        })
      }
    }

    // Convert to leaderboard entries
    const leaderboard: LeaderboardEntry[] = Array.from(contributorStats.entries())
      .map(([address, stats], index) => ({
        address,
        name: stats.name,
        totalContributed: stats.totalContributed,
        goalsContributed: stats.goalsContributed,
        rank: index + 1,
        avatar: undefined // Could be fetched from a service
      }))
      .sort((a, b) => Number(b.totalContributed - a.totalContributed))

    dispatch({ type: 'UPDATE_LEADERBOARD', payload: leaderboard })
  }

  return (
    <CollaborationContext.Provider
      value={{
        collaborations: state.collaborations,
        leaderboard: state.leaderboard,
        createCollaborativeGoal,
        inviteCollaborator,
        acceptInvite,
        declineInvite,
        addContribution,
        getGoalCollaboration,
        getUserCollaborations,
        getPendingInvites,
        updateLeaderboard
      }}
    >
      {children}
    </CollaborationContext.Provider>
  )
}