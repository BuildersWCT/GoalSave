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
      console.error('Failed to load goals:', error)
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
    </div>
  )
}