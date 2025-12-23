import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCollaboration } from '../hooks/useCollaboration'
import { CollaborationInvite } from './CollaborationInvite'
import { ContributorLeaderboard } from './ContributorLeaderboard'
import { CurrencyDisplay } from './CurrencyDisplay'
import './GoalCollaboration.css'

interface GoalCollaborationProps {
  goalId: string
  goalName: string
}

export function GoalCollaboration({ goalId, goalName }: GoalCollaborationProps) {
  const { t } = useTranslation()
  const { getGoalCollaboration, createCollaborativeGoal } = useCollaboration()
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const collaboration = getGoalCollaboration(goalId)

  const handleMakeCollaborative = () => {
    createCollaborativeGoal(goalId)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!collaboration) {
    return (
      <div className="goal-collaboration-setup">
        <div className="collaboration-prompt">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          </svg>
          <h4>{t('makeGoalCollaborative')}</h4>
          <p>{t('collaborationDescription')}</p>
          <button onClick={handleMakeCollaborative} className="make-collaborative-btn">
            {t('enableCollaboration')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="goal-collaboration">
      <div className="collaboration-header">
        <h4>{t('goalCollaboration')}</h4>
        <div className="collaboration-actions">
          <button onClick={() => setShowLeaderboard(true)} className="leaderboard-btn">
            🏆 {t('leaderboard')}
          </button>
          <button onClick={() => setShowInviteModal(true)} className="invite-btn">
            👥 {t('inviteCollaborator')}
          </button>
        </div>
      </div>

      <div className="collaboration-stats">
        <div className="stat-item">
          <span className="stat-label">{t('totalContributors')}</span>
          <span className="stat-value">{collaboration.collaborators.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('totalContributions')}</span>
          <CurrencyDisplay
            amount={Number(collaboration.totalContributions) / 1e18}
            originalCurrency="CELO"
            className="stat-value"
          />
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('pendingInvites')}</span>
          <span className="stat-value">{collaboration.pendingInvites.length}</span>
        </div>
      </div>

      <div className="collaborators-section">
        <h5>{t('collaborators')}</h5>
        {collaboration.collaborators.length === 0 ? (
          <p className="no-collaborators">{t('noCollaboratorsYet')}</p>
        ) : (
          <div className="collaborators-list">
            {collaboration.collaborators.map((collaborator) => (
              <div key={collaborator.id} className="collaborator-item">
                <div className="collaborator-avatar">
                  {collaborator.avatar ? (
                    <img src={collaborator.avatar} alt={collaborator.name || formatAddress(collaborator.address)} />
                  ) : (
                    <div className="default-avatar">
                      {(collaborator.name || collaborator.address).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="collaborator-info">
                  <div className="collaborator-name">
                    {collaborator.name || formatAddress(collaborator.address)}
                  </div>
                  <div className="collaborator-role">
                    {t(collaborator.role)}
                  </div>
                  <div className="collaborator-stats">
                    <span>{t('contributions')}: {collaborator.contributionCount}</span>
                    <span>•</span>
                    <CurrencyDisplay
                      amount={Number(collaborator.totalContributed) / 1e18}
                      originalCurrency="CELO"
                      className="contribution-amount"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {collaboration.pendingInvites.length > 0 && (
        <div className="pending-invites-section">
          <h5>{t('pendingInvites')}</h5>
          <div className="pending-invites-list">
            {collaboration.pendingInvites.map((invite) => (
              <div key={invite.id} className="pending-invite-item">
                <div className="invite-address">{formatAddress(invite.inviteeAddress)}</div>
                <div className="invite-status">{t(invite.status)}</div>
                <div className="invite-date">
                  {new Date(invite.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showInviteModal && (
        <CollaborationInvite
          goalId={goalId}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {showLeaderboard && (
        <ContributorLeaderboard
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  )
}