import React from 'react'
import { useTranslation } from 'react-i18next'
import { useReadContract } from 'wagmi'
import { CeloSaveABI } from './CeloSaveABI'
import { CurrencyDisplay } from './components/CurrencyDisplay'
import { GoalCollaboration } from './components/GoalCollaboration'
import { SavingsTips } from './components/SavingsTips'
import { ProgressBar } from './components/ProgressBar'
import { useMilestoneDetection } from './hooks/useMilestoneDetection'
import { useNotifications } from './contexts/NotificationContext'
import { errorLogger } from './utils/errorLogger'

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
}

export function GoalList() {
  const { t } = useTranslation()
  const { addNotification } = useNotifications()
  const [retryCount, setRetryCount] = React.useState(0)
  const { data: goals, isLoading, error, refetch } = useReadContract({
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

  // Initialize milestone detection
  useMilestoneDetection({ goals, isLoading })

  if (isLoading) return <div className="goal-list"><p>{t('loading')}</p></div>

  if (error) return (
    <div className="goal-list">
      <p>{t('errorLoadingGoals')}</p>
      <button onClick={handleRetry} disabled={isLoading}>
        {t('retry')}
      </button>
      {retryCount > 0 && <p>{t('retryAttempts')}: {retryCount}</p>}
    </div>
  )

  return (
    <div className="goal-list">
      <h3>{t('yourGoals')}</h3>
      {!goals || goals.length === 0 ? (
        <p>{t('noGoals')}</p>
      ) : (
        goals.map((goal) => {
          // Determine the currency based on token address
          const tokenCurrency = goal.token === '0x0000000000000000000000000000000000000000' ? 'CELO' : 'USD'

          // Convert from wei to regular units (assuming 18 decimal places)
          const targetAmount = Number(goal.target) / 1e18
          const balanceAmount = Number(goal.balance) / 1e18

          // Calculate progress percentage
          const progressPercentage = targetAmount > 0 ? (balanceAmount / targetAmount) * 100 : 0

          return (
            <div key={goal.id.toString()} className="goal-item">
              <h4>{goal.name}</h4>
              <div className="goal-details">
                <div className="amount-section">
                  <label>{t('target')}:</label>
                  <CurrencyDisplay
                    amount={targetAmount}
                    originalCurrency={tokenCurrency}
                    className="target-currency"
                  />
                </div>
                <div className="amount-section">
                  <label>{t('balance')}:</label>
                  <CurrencyDisplay
                    amount={balanceAmount}
                    originalCurrency={tokenCurrency}
                    className="balance-currency"
                  />
                </div>
                <ProgressBar percentage={progressPercentage} />
                <p>{t('token')}: {tokenCurrency}</p>
                <p>{t('status')}: {goal.closed ? 'Closed' : 'Active'}</p>
              </div>

              <GoalCollaboration
                goalId={goal.id.toString()}
                goalName={goal.name}
              />
            </div>
          )
        })
      )}
      <SavingsTips goals={goals} isLoading={isLoading} />
    </div>
  )
}