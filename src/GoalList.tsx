import { useTranslation } from 'react-i18next'
import { useReadContract } from 'wagmi'
import { CeloSaveABI } from './CeloSaveABI'

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
  const { data: goals, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CeloSaveABI,
    functionName: 'getMyGoals',
  }) as { data: Goal[] | undefined; isLoading: boolean }

  if (isLoading) return <div className="goal-list"><p>{t('loading')}</p></div>

  return (
    <div className="goal-list">
      <h3>{t('yourGoals')}</h3>
      {!goals || goals.length === 0 ? (
        <p>{t('noGoals')}</p>
      ) : (
        goals.map((goal) => (
          <div key={goal.id.toString()} className="goal-item">
            <h4>{goal.name}</h4>
            <p>{t('target')}: {goal.target.toString()}</p>
            <p>{t('balance')}: {goal.balance.toString()}</p>
            <p>{t('token')}: {goal.token === '0x0000000000000000000000000000000000000000' ? 'CELO' : goal.token}</p>
            <p>{t('status')}: {goal.closed ? 'Closed' : 'Active'}</p>
          </div>
        ))
      )}
    </div>
  )
}