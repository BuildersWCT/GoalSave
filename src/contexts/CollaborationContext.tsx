  const inviteCollaborator = async (goalId: string, inviteeAddress: string, message?: string): Promise<void> => {
    try {
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
    } catch (error) {
      console.error('Failed to invite collaborator:', error)
      throw error
    }
  }

  const acceptInvite = async (inviteId: string): Promise<void> => {
    try {
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
    } catch (error) {
      console.error('Failed to accept invite:', error)
      throw error
    }
  }

  const declineInvite = async (inviteId: string): Promise<void> => {
    try {
      dispatch({ type: 'UPDATE_INVITE', payload: { inviteId, status: 'declined' } })
    } catch (error) {
      console.error('Failed to decline invite:', error)
      throw error
    }
  }