import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CeloSaveABI } from './CeloSaveABI'
import { ExportControls } from './components/ExportControls'

const CONTRACT_ADDRESS = '0xF9Ba5E30218B24C521500Fe880eE8eaAd2897055' as `0x${string}`

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

interface GoalListProps {
  onEditGoal?: (goalData: {
    name: string
    token: string
    target: string
    lockUntil: string
  }) => void
}

export function GoalList({ onEditGoal }: GoalListProps) {
  const { t } = useTranslation()
  const [showArchived, setShowArchived] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  
  const { data: goals, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CeloSaveABI,
    functionName: 'getMyGoals',
  }) as { data: Goal[] | undefined; isLoading: boolean; error: Error | null; refetch: () => void }

  // Handle read contract errors
  React.useEffect(() => {
    if (error) {
      errorLogger.logError(error, 'GoalList.readContract')
      addNotification({
        type: 'warning',
        title: t('failedToLoadGoals'),
        message: error.message || t('unknownError'),
      })
    }
  }, [error, addNotification, t])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    refetch()
  }

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })

  const handleArchiveGoal = async (goalId: bigint) => {
    setRefreshing(true)
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CeloSaveABI,
      functionName: 'archiveGoal',
      args: [goalId],
    })
  }

  const handleRestoreGoal = async (goalId: bigint) => {
    setRefreshing(true)
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CeloSaveABI,
      functionName: 'restoreGoal',
      args: [goalId],
    })
  }

  const handleDuplicateGoal = (goal: Goal) => {
    // Convert the goal data to a format suitable for the form
    const goalForEditing = {
      name: `${goal.name} (Copy)`,
      token: goal.token,
      target: goal.target.toString(),
      lockUntil: goal.lockUntil.toString()
    }

    // Pass this to the parent component to show the form with these values
    if (onEditGoal) {
      onEditGoal(goalForEditing)
    }
  }

  // Refresh goals after transaction
  useEffect(() => {
    if (hash && !isConfirming) {
      setRefreshing(false)
    }
  }, [hash, isConfirming])

  // Filter goals based on showArchived state
  const filteredGoals = goals?.filter(goal => showArchived ? goal.archived : !goal.archived) || []

  if (isLoading) return <div className="goal-list"><p>{t('loading')}</p></div>

  const activeGoals = goals?.filter(goal => !goal.archived) || []
  const archivedGoals = goals?.filter(goal => goal.archived) || []

  return (
    <div className="goal-list">
      {/* Export Controls */}
      {goals && goals.length > 0 && (
        <ExportControls goals={goals} />
      )}

      <div className="goal-list-header">
        <h3>{t('yourGoals')}</h3>
        <div className="goal-view-toggle">
          <button 
            className={!showArchived ? 'active' : ''}
            onClick={() => setShowArchived(false)}
            disabled={activeGoals.length === 0}
            aria-label={`View active goals (${activeGoals.length} total)`}
          >
            Active ({activeGoals.length})
          </button>
          <button 
            className={showArchived ? 'active' : ''}
            onClick={() => setShowArchived(true)}
            disabled={archivedGoals.length === 0}
            aria-label={`View archived goals (${archivedGoals.length} total)`}
          >
            Archived ({archivedGoals.length})
          </button>
        </div>
      </div>

      {!filteredGoals || filteredGoals.length === 0 ? (
        <p>{showArchived ? t('noArchivedGoals') : t('noActiveGoals')}</p>
      ) : (
        filteredGoals.map((goal) => (
          <div key={goal.id.toString()} className={`goal-item ${goal.archived ? 'goal-item--archived' : ''}`}>
            <h4>{goal.name}</h4>
            <div className="goal-details">
              <p>{t('target')}: {goal.target.toString()}</p>
              <p>{t('balance')}: {goal.balance.toString()}</p>
              <p>{t('token')}: {goal.token === '0x0000000000000000000000000000000000000000' ? 'CELO' : goal.token}</p>
              <p>{t('status')}: {goal.closed ? 'Closed' : 'Active'}</p>
              {goal.archived && <p><strong>{t('archived')}</strong>: Yes</p>}
            </div>
            <div className="goal-actions">
              {!goal.archived && (
                <>
                  <button
                    onClick={() => handleDuplicateGoal(goal)}
                    disabled={isPending || isConfirming || refreshing}
                    className="btn-duplicate"
                    aria-label={`Duplicate goal: ${goal.name}`}
                    title={`Duplicate goal: ${goal.name}`}
                  >
                    {t('duplicate')}
                  </button>
                  <button
                    onClick={() => handleArchiveGoal(goal.id)}
                    disabled={isPending || isConfirming || refreshing}
                    className="btn-archive"
                    aria-label={`Archive goal: ${goal.name}`}
                    title={`Archive goal: ${goal.name}`}
                  >
                    {isPending || isConfirming || refreshing ? t('archiving') : t('archive')}
                  </button>
                </>
              )}
              {goal.archived && (
                <button
                  onClick={() => handleRestoreGoal(goal.id)}
                  disabled={isPending || isConfirming || refreshing}
                  className="btn-restore"
                  aria-label={`Restore goal: ${goal.name}`}
                  title={`Restore goal: ${goal.name}`}
                >
                  {isPending || isConfirming || refreshing ? t('restoring') : t('restore')}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}